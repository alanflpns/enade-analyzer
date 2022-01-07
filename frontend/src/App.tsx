import { useEffect } from "react";
import { VictoryChart, VictoryBar, VictoryAxis, VictoryLabel } from "victory";
import Requests from "./services/Requests";

function App() {
  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    try {
      const response = await Requests.getData();

      console.log(response);
    } catch (err) {
      console.log(err);
    }
  }

  const data = [
    {
      result: [
        { resposta: true, count: 12, percent: "0.545" },
        { resposta: false, count: 10, percent: "0.455" },
      ],
      total: 22,
      tema: "Arquitetura da informação",
    },
    {
      result: [
        { resposta: false, count: 14, percent: "0.636" },
        { resposta: true, count: 8, percent: "0.364" },
      ],
      total: 22,
      tema: "Redes de Computadores e Sistemas Distribuídos",
    },
    {
      result: [{ resposta: true, count: 11, percent: "1.000" }],
      total: 11,
      tema: "Engenharia de Software",
    },
    {
      result: [
        { resposta: true, count: 7, percent: "0.636" },
        { resposta: false, count: 4, percent: "0.364" },
      ],
      total: 11,
      tema: "Algoritmos e Estruturas de Dados",
    },
    {
      result: [
        { resposta: false, count: 8, percent: "0.727" },
        { resposta: true, count: 3, percent: "0.273" },
      ],
      total: 11,
      tema: "Qualidade de Processo e Produto",
    },
    {
      result: [
        { resposta: false, count: 7, percent: "0.636" },
        { resposta: true, count: 4, percent: "0.364" },
      ],
      total: 11,
      tema: "Pesquisa Operacional",
    },
    {
      result: [
        { resposta: true, count: 9, percent: "0.409" },
        { resposta: false, count: 13, percent: "0.591" },
      ],
      total: 22,
      tema: "Gestão do Conhecimento",
    },
    {
      result: [
        { resposta: false, count: 2, percent: "0.182" },
        { resposta: true, count: 9, percent: "0.818" },
      ],
      total: 11,
      tema: "Modelagem de Sistemas de Informação",
    },
    {
      result: [
        { resposta: false, count: 8, percent: "0.727" },
        { resposta: true, count: 3, percent: "0.273" },
      ],
      total: 11,
      tema: "Arquitetura empresarial e da tecnologia da informação",
    },
    {
      result: [
        { resposta: false, count: 6, percent: "0.545" },
        { resposta: true, count: 5, percent: "0.455" },
      ],
      total: 11,
      tema: "Lógica Matemática e Matemática Discreta",
    },
    {
      result: [
        { resposta: false, count: 9, percent: "0.818" },
        { resposta: true, count: 2, percent: "0.182" },
      ],
      total: 11,
      tema: "Sistemas Operacionais",
    },
    {
      result: [
        { resposta: true, count: 5, percent: "0.455" },
        { resposta: false, count: 6, percent: "0.545" },
      ],
      total: 11,
      tema: "Informática e Sociedade",
    },
    {
      result: [
        { resposta: false, count: 6, percent: "0.545" },
        { resposta: true, count: 5, percent: "0.455" },
      ],
      total: 11,
      tema: "Fundamentos, Paradigmas e Linguagens de Programação;",
    },
    {
      result: [
        { resposta: true, count: 6, percent: "0.545" },
        { resposta: false, count: 5, percent: "0.455" },
      ],
      total: 11,
      tema: "Gerência de Projetos",
    },
    {
      result: [
        { resposta: false, count: 7, percent: "0.636" },
        { resposta: true, count: 4, percent: "0.364" },
      ],
      total: 11,
      tema: "Probabilidade e Estatística",
    },
    {
      result: [
        { resposta: false, count: 4, percent: "0.364" },
        { resposta: true, count: 7, percent: "0.636" },
      ],
      total: 11,
      tema: "Segurança e Auditoria de Sistemas",
    },
    {
      result: [
        { resposta: true, count: 8, percent: "0.727" },
        { resposta: false, count: 3, percent: "0.273" },
      ],
      total: 11,
      tema: "Gestão de Processos de Negócio",
    },
    {
      result: [
        { resposta: false, count: 6, percent: "0.545" },
        { resposta: true, count: 5, percent: "0.455" },
      ],
      total: 11,
      tema: "Interação Humano-Computador",
    },
    {
      result: [
        { resposta: true, count: 1, percent: "0.091" },
        { resposta: false, count: 10, percent: "0.909" },
      ],
      total: 11,
      tema: "Arquitetura e Organização de Computadores",
    },
  ];

  const newData: any = [];
  data.forEach((item) => {
    item.result
      .filter((res) => res.resposta)
      .map((res) => {
        const newItem = {
          ...res,
          percent: Number(res.percent) * 100,
          tema: item.tema,
        };
        newData.push(newItem);
      });
  });

  return (
    <div>
      <div
        style={{
          width: 600,
        }}
      >
        <VictoryChart>
          <VictoryAxis
            crossAxis
            height={300}
            tickLabelComponent={
              <VictoryLabel
                angle={-60}
                textAnchor="end"
                dx={5}
                dy={-10}
                style={{ fontSize: 10, zIndex: 5 }}
              />
            }
          />
          <VictoryAxis dependentAxis />
          <VictoryBar data={newData} x="tema" y="percent" />
        </VictoryChart>
      </div>
    </div>
  );
}

export default App;
