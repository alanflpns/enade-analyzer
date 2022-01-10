export interface QuestionsByTheme {
  tema: string;
  questions: string[];
  qtQuestions: number;
}

export type Year = "2014" | "2017";

export interface ResultData {
  count: number;
  percent: string;
  resposta: boolean;
}

export interface Data {
  total: number;
  result: ResultData[];
  tema: string;
}

export interface DataChart extends Data {
  percent: number;
  tema: string;
  label: string;
}
