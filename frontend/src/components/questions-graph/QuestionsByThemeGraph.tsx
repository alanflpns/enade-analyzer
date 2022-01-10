/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect } from "react";
import { Loader, Segment } from "semantic-ui-react";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLabel,
  VictoryTheme,
  VictoryTooltip,
} from "victory";
import { YEARS } from "../../constants";

import useQuestionsByTheme from "../../hooks/useQuestionsByTheme";
import { QuestionsByTheme, Year } from "../../types";

function QuestionsGraph() {
  const { error, getQuestionsByTheme, isLoading, questionsByTheme } =
    useQuestionsByTheme();

  useEffect(() => {
    getQuestionsByTheme(YEARS);
  }, []);

  const chart = useCallback(
    (year: string, questionsByTheme: QuestionsByTheme[]) => {
      return (
        <div style={{ width: 500 }}>
          <VictoryChart
            animate={{ duration: 500 }}
            theme={VictoryTheme.material}
            padding={{ left: 70, bottom: 350, top: 20, right: 50 }}
            height={600}
            width={400}
          >
            <VictoryLabel
              text={`Nº de questões por tema no ano de (${year})`}
              x={200}
              y={10}
              textAnchor="middle"
              style={{ fill: "#000", fontSize: 10 }}
            />

            <VictoryAxis
              crossAxis
              tickLabelComponent={
                <VictoryLabel
                  angle={-80}
                  textAnchor="end"
                  dx={5}
                  dy={-10}
                  style={{ fontSize: 12 }}
                  labelPlacement="vertical"
                />
              }
            />
            <VictoryAxis
              dependentAxis
              tickFormat={(tick) => {
                if (String(tick).indexOf(".5") !== -1) {
                  return "";
                }

                return String(tick).replace(".0", "");
              }}
            />
            <VictoryBar
              data={questionsByTheme}
              x="tema"
              y="qtQuestions"
              labelComponent={
                <VictoryTooltip
                  constrainToVisibleArea
                  style={{ fontSize: 10 }}
                />
              }
              labels={(point) =>
                `${point.datum.tema}: ${point.datum.qtQuestions} ${
                  point.datum.qtQuestions === 1 ? "questão" : "questões"
                }`
              }
            />
          </VictoryChart>
        </div>
      );
    },

    []
  );

  if (isLoading) {
    return <Loader active size="big" />;
  }

  if (error) {
    return (
      <div>
        <p>Ocorreu um erro 🚫</p> <p>{error}</p>
      </div>
    );
  }

  if (!questionsByTheme) {
    return <div>Infelizmente nenhum dado foi encontrado 🙁</div>;
  }

  return (
    <div>
      {Object.keys(questionsByTheme).map((key) => (
        <Segment>{chart(key, questionsByTheme[key as Year])}</Segment>
      ))}
    </div>
  );
}

export default QuestionsGraph;
