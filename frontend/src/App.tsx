import { useEffect, useMemo, useState } from "react";
import { Segment, Header, Form, Loader } from "semantic-ui-react";
import BarGraph from "./components/bar-graph/BarGraph";

import QuestionsGraph from "./components/questions-graph/QuestionsByThemeGraph";
import { YEARS } from "./constants";
import Requests from "./services/Requests";
import { Data, DataChart } from "./types";

export interface IDataGraph {
  year: string;
  result: DataChart[];
}

export interface IES {
  cod_ies: number;
  sigla: string;
  municipio: string;
  uf: string;
}

function App() {
  const [dataGeral, setDataGeral] = useState<IDataGraph[]>([]);
  const [dataIes, setDataIes] = useState<IDataGraph[]>([]);
  const [dataUf, setDataUf] = useState<IDataGraph[]>([]);

  const [iesList, setIesList] = useState<IES[]>([]);
  const [iesOptions, setIesOptions] = useState([]);
  const [currentIes, setCurrentIes] = useState<number>();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isLoadingGeralData, setIsLoadingGeralData] = useState(false);

  useEffect(() => {
    getIes();
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentIes) {
      getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIes]);

  const currentIesObj = useMemo(
    () => iesList.find((ies) => ies.cod_ies === currentIes),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentIes]
  );

  function createDataChart(response: Data[]) {
    const newData: any = [];
    response.forEach((item) => {
      item.result
        .filter((res) => res.resposta)
        // eslint-disable-next-line array-callback-return
        .map((res) => {
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
        setIsLoadingGeralData(true);
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
      setIsLoadingGeralData(false);
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

  if (isLoadingGeralData)
    return (
      <Header as="h2" icon textAlign="center">
        <Loader active>Carregando dados...</Loader>
      </Header>
    );

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
              <label>Instituição</label>
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

      <BarGraph
        currentIesObj={currentIesObj}
        dataGeral={dataGeral}
        dataIes={dataIes}
        dataUf={dataUf}
        isLoadingData={isLoadingData}
      />

      <Segment>
        <QuestionsGraph />
      </Segment>
    </div>
  );
}

export default App;
