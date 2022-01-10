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
        <VictoryChart
          animate={{ duration: 500 }}
          theme={VictoryTheme.material}
          padding={{ left: 100, bottom: 50, top: 30, right: 50 }}
          height={600}
          width={400}
        >
          <VictoryLabel
            text={`Nº de questões por tema no ano de (${year})`}
            x={225}
            y={10}
            textAnchor="middle"
            style={{ fill: "#000", fontSize: 10 }}
          />
          <VictoryAxis
            crossAxis
            tickLabelComponent={
              <VictoryLabel
                style={{ fontSize: 6 }}
                textAnchor="end"
                labelPlacement="perpendicular"
              />
            }
            tickFormat={(tick: string) => {
              // This functions divide the tema in a lot of parts to take up less space
              const words = tick.split(" ");

              const wordsString = words.reduce(
                (prevValue, curValue, curIndex, array) => {
                  const lastIndexWordBreak = prevValue.lastIndexOf("\n");
                  const prevValueValidated =
                    prevValue.substring(lastIndexWordBreak);
                  const newValueValidated = `${prevValueValidated} ${curValue}`;

                  if (newValueValidated.length > 30) {
                    return `${prevValue}\n${curValue}`;
                  }

                  return `${prevValue} ${curValue}`;
                },
                ""
              );
              return wordsString;
            }}
            minDomain={0}
          />
          <VictoryAxis
            dependentAxis
            label="Nº de questões"
            scale={{ y: "time" }}
            style={{
              axis: {
                stroke: "transparent",
              },
              tickLabels: {
                fill: "#000",
                fontSize: 8,
              },
              axisLabel: {
                fill: "#000",
                padding: 30,
                fontSize: 8,
                fontStyle: "italic",
              },
            }}
          />

          <VictoryBar
            horizontal
            data={questionsByTheme}
            x="tema"
            y="qtQuestions"
            labelComponent={
              <VictoryTooltip style={{ fontSize: 6 }} constrainToVisibleArea />
            }
            labels={(point) =>
              `${point.datum.tema}: ${point.datum.qtQuestions} ${
                point.datum.qtQuestions === 1 ? "questão" : "questões"
              }`
            }
          />
        </VictoryChart>
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

  console.log(Object.entries(questionsByTheme));

  return (
    <Segment>
      {Object.keys(questionsByTheme).map((key) =>
        chart(key, questionsByTheme[key as Year])
      )}
    </Segment>
  );
}

export default QuestionsGraph;
