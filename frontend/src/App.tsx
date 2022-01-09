import { useEffect, useState } from "react";
import {
  Dropdown,
  Segment,
  Header,
  Icon,
  Form,
  Loader,
} from "semantic-ui-react";

import {
  VictoryChart,
  VictoryBar,
  VictoryAxis,
  VictoryLabel,
  VictoryTheme,
  VictoryTooltip,
} from "victory";
import Requests from "./services/Requests";

const iesDefault = 3183;

function App() {
  const [data, setData] = useState([]);
  const [iesList, setIesList] = useState<any>([]);
  const [currentIes, setCurrentIes] = useState<number>();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    getIes();
  }, []);

  useEffect(() => {
    if (iesList.length > 0) {
      setCurrentIes(iesDefault);
    }
  }, [iesList]);

  useEffect(() => {
    if (currentIes) {
      getData();
    }
  }, [currentIes]);

  async function getData() {
    setIsLoadingData(true);

    try {
      const response = await Requests.getData("2017", currentIes!);

      const newData: any = [];
      response.data.forEach((item: any) => {
        item.result
          .filter((res: any) => res.resposta)
          .map((res: any) => {
            const newItem = {
              ...res,
              percent: Number(res.percent) * 100,
              tema: item.tema,
              label: `${item.tema} (${(Number(res.percent) * 100).toFixed(
                2
              )}%)`,
            };
            newData.push(newItem);
          });
      });

      setData(newData);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoadingData(false);
    }
  }

  async function getIes() {
    setIsLoading(true);
    try {
      const response = await Requests.getIes();

      const newIes = response.data.map((ies: any) => ({
        key: ies.cod_ies,
        text: `${ies.sigla !== "-" ? ies.sigla : ""} / ${ies.municipio} - ${
          ies.uf
        }`,
        value: ies.cod_ies,
      }));

      setIesList(newIes);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }

  function renderChart() {
    return (
      <Segment style={{ width: 500 }}>
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
              <label>Filtro</label>
              <Form.Select
                options={iesList}
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

      {iesList.length > 0 ? (
        <Segment loading={isLoadingData}>
          {data.length > 0 ? (
            renderChart()
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
      )}
    </div>
  );
}

export default App;
