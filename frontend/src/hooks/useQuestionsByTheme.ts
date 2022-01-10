import { useState } from "react";
import Requests from "../services/Requests";
import { QuestionsByTheme, Year } from "../types";

type QuestionsByThemeYears = Record<Year, QuestionsByTheme[]>;

const useQuestionsByTheme = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [questionsByTheme, setQuestionsByTheme] =
    useState<QuestionsByThemeYears>();

  async function getQuestionsByTheme(years: Year[]) {
    setIsLoading(true);

    try {
      const responses = await Promise.all(
        years.map((year) => Requests.getQuestionsByTheme(year))
      );

      if (responses) {
        const newQuestionsByTheme = years.reduce(
          (prevValue, curValue, index) => {
            const response = responses[index].data;

            return {
              ...prevValue,
              [curValue]: response,
            };
          },
          {} as QuestionsByThemeYears
        );

        setQuestionsByTheme(newQuestionsByTheme);
        setError("");
      }
    } catch (err: any) {
      console.log(err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return {
    isLoading,
    error,
    questionsByTheme,
    getQuestionsByTheme,
  };
};

export default useQuestionsByTheme;
