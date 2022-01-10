import { useEffect, useState } from "react";
import { Segment, Header, Form } from "semantic-ui-react";

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
    setIsLoadingData(true);

    try {
      if (currentIes) {
        const promisesIes = YEARS.map((year) =>
          Requests.getData(year, currentIes)
        );
        const promisesUf = YEARS.map((year) =>
          Requests.getData(
            year,
            undefined,
            iesList.find((ies) => ies.cod_ies === currentIes)!.uf
          )
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
      <Segment style={{ width: 500 }}>
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

      <Segment>
        <QuestionsGraph />
      </Segment>

      {dataGeral.map((data) => renderChart(`${data.year} Geral`, data.result))}
      {dataIes.map((data) => renderChart(`${data.year} Ies`, data.result))}
      {dataUf.map((data) => renderChart(`${data.year} Uf`, data.result))}

      {/* <div style={{ display: "flex", justifyContent: "space-between" }}>
        {renderChart("2014 Geral", data2014Geral)} */}
      {/* {currentIes && (
          <>
            {renderChart("2014 Ies", data2014Ies)}
            {renderChart("2014 Estado", data2014Uf)}
          </>
        )} */}
      {/* </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {renderChart("2017 Geral", data2017Geral)} */}
      {/* {currentIes && (
          <>
            {renderChart("2017 Ies", data2017Ies)}
            {renderChart("2017 Estado", data2017Uf)}
          </>
        )} */}
      {/* </div> */}
      {/* {iesList.length > 0 ? (
      

      {iesList.length > 0 ? (
        <Segment loading={isLoadingData}>
          {data.length > 0 ? (
            renderChart2014()
          ) : (
            <Segment>
              <Header as="h2" icon textAlign="center">
                <Icon name="folder open outline" />
                Infelizmente nenhum dado foi encontrado
              </Header>
            </Segment>
          )}
        </Segment>
      ) : (
        <Header as="h2" icon textAlign="center">
          <Loader active>Carregando dados...</Loader>
        </Header>
      )} */}
    </div>
  );
}

export default App;
