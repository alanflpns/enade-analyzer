import { Segment, Header } from "semantic-ui-react";
import {
  VictoryChart,
  VictoryBar,
  VictoryAxis,
  VictoryLabel,
  VictoryTheme,
  VictoryTooltip,
} from "victory";
import { IDataGraph, IES } from "../../App";

interface Props {
  isLoadingData: boolean;
  dataGeral: IDataGraph[];
  dataIes: IDataGraph[];
  dataUf: IDataGraph[];
  currentIesObj?: IES;
}

function BarGraph({
  isLoadingData,
  dataGeral,
  dataIes,
  dataUf,
  currentIesObj,
}: Props) {
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
    <>
      {dataGeral.length > 0 && (
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
      )}
    </>
  );
}

export default BarGraph;
