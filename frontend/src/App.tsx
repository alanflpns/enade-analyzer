import { useEffect, useMemo, useState } from "react";
import { Segment, Header, Form, Loader } from "semantic-ui-react";

import {
  VictoryChart,
  VictoryBar,
  VictoryAxis,
  VictoryLabel,
  VictoryTheme,
  VictoryTooltip,
} from "victory";
import QuestionsGraph from "./components/questions-graph/QuestionsByThemeGraph";
import { YEARS } from "./constants";
import Requests from "./services/Requests";

interface IData {
  year: string;
  result: any;
}

interface IES {
  cod_ies: number;
  sigla: string;
  municipio: string;
  uf: string;
}

function App() {
  const [dataGeral, setDataGeral] = useState<IData[]>([]);
  const [dataIes, setDataIes] = useState<IData[]>([]);
  const [dataUf, setDataUf] = useState<IData[]>([]);

  const [iesList, setIesList] = useState<IES[]>([]);
  const [iesOptions, setIesOptions] = useState([]);
  const [currentIes, setCurrentIes] = useState<number>();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    getIes();
    getData();
  }, []);

  useEffect(() => {
    if (currentIes) {
      getData();
    }
  }, [currentIes]);

  const currentIesObj = useMemo(
    () => iesList.find((ies) => ies.cod_ies === currentIes),
    [currentIes]
  );

  function createDataChart(response: any) {
    const newData: any = [];
    response.forEach((item: any) => {
      item.result
        .filter((res: any) => res.resposta)
        .map((res: any) => {
          const newItem = {
            ...res,
            percent: Number(res.percent) * 100,
            tema: item.tema,
            label: `${item.tema} (${(Number(res.percent) * 100).toFixed(2)}%)`,
          };

          newData.push(newItem);
        });
    });

    return newData;
  }

  async function getData() {
    try {
      if (currentIes) {
        setIsLoadingData(true);

        const promisesIes = YEARS.map((year) =>
          Requests.getData(year, currentIes)
        );
        const promisesUf = YEARS.map((year) =>
          Requests.getData(year, undefined, currentIesObj?.uf)
        );

        const responseIes = await Promise.all(promisesIes);
        const responseUf = await Promise.all(promisesUf);

        setDataIes(
          responseIes.map((resp, index) => ({
            year: YEARS[index],
            result: createDataChart(resp.data),
          }))
        );
        setDataUf(
          responseUf.map((resp, index) => ({
            year: YEARS[index],
            result: createDataChart(resp.data),
          }))
        );
      } else {
        const promises = YEARS.map((year) => Requests.getData(year));

        const response = await Promise.all(promises);

        setDataGeral(
          response.map((resp, index) => ({
            year: YEARS[index],
            result: createDataChart(resp.data),
          }))
        );
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoadingData(false);
    }
  }

  async function getIes() {
    setIsLoading(true);
    try {
      const response = (await Requests.getIes()).data;

      const newIes = response.map((ies: any) => ({
        key: ies.cod_ies,
        text: `${ies.sigla !== "-" ? ies.sigla : ""} / ${ies.municipio} - ${
          ies.uf
        }`,
        value: ies.cod_ies,
      }));

      setIesList(response);
      setIesOptions(newIes);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }

  function renderChart(title: string, data: any) {
    return (
      <Segment
        style={{ width: 500 }}
        loading={title !== "Brasil" && isLoadingData}
      >
        <Header>{title}</Header>
        <VictoryChart
          animate={{ duration: 500 }}
          theme={VictoryTheme.material}
          padding={{ left: 70, bottom: 350, top: 10, right: 50 }}
          height={600}
          width={400}
        >
          <VictoryAxis
            crossAxis
            tickLabelComponent={
              <VictoryLabel
                angle={-80}
                textAnchor="end"
                dx={5}
                dy={-10}
                labelPlacement="vertical"
              />
            }
          />
          <VictoryAxis dependentAxis />
          <VictoryBar
            data={data}
            x="tema"
            y="percent"
            labelComponent={<VictoryTooltip style={{ fontSize: 10 }} />}
          />
        </VictoryChart>
      </Segment>
    );
  }

  return (
    <div style={{ display: "flex", padding: 20, flexDirection: "column" }}>
      <div>
        <Header as="h2" textAlign="center">
          Análise ENADE
        </Header>
      </div>

      <div>
        <Form>
          <Form.Group widths="equal">
            <Form.Field>
              <label>Campus</label>
              <Form.Select
                options={iesOptions}
                search
                selection
                loading={isLoading}
                value={currentIes}
                placeholder="Selecione um campus"
                disabled={isLoading}
                onChange={(ev, data) => setCurrentIes(data.value as number)}
              />
            </Form.Field>
          </Form.Group>
        </Form>
      </div>

      {dataGeral.length > 0 ? (
        <>
          <div>
            <Header>2017</Header>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                gap: 10,
              }}
            >
              {renderChart(`Brasil`, dataGeral[1].result)}
              {dataIes.length > 0 && dataUf.length > 0 && (
                <>
                  {renderChart(
                    `Estado - ${currentIesObj?.uf}`,
                    dataUf[1].result
                  )}
                  {renderChart(
                    `Instituição - ${currentIesObj?.sigla}`,
                    dataIes[1].result
                  )}
                </>
              )}
            </div>
          </div>
          <div
            style={{
              marginTop: 20,
            }}
          >
            <Header>2014</Header>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                gap: 10,
              }}
            >
              {renderChart(`Brasil`, dataGeral[0].result)}
              {dataIes.length > 0 && dataUf.length > 0 && (
                <>
                  {renderChart(
                    `Estado - ${currentIesObj?.uf}`,
                    dataUf[0].result
                  )}
                  {renderChart(
                    `Instituição - ${currentIesObj?.sigla}`,
                    dataIes[0].result
                  )}
                </>
              )}
            </div>
          </div>
        </>
      ) : (
        <Header as="h2" icon textAlign="center">
          <Loader active>Carregando dados...</Loader>
        </Header>
      )}

      <Segment>
        <QuestionsGraph />
      </Segment>
    </div>
  );
}

export default App;
