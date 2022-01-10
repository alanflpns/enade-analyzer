import queryString from "query-string";

export const stringifyQueryString = (obj: any) => {
  const keys = Object.keys(obj).filter((key) => obj[key] != "");
  const retorno: any = {};
  keys.forEach((key) => (retorno[key] = obj[key]));
  return queryString.stringify(retorno);
};
