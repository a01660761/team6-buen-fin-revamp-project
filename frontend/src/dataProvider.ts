import jsonServerProvider from "ra-data-json-server";
import type { DataProvider } from "react-admin";

const jsonProvider = jsonServerProvider(import.meta.env.VITE_JSON_SERVER_URL);

// NUEVO (issue #19): alias de recurso definido en docs/api-contract.md, sección 9.
// El frontend usa el recurso "businesses", pero las lecturas públicas van a /public/companies.
// Solo cubre getList, getOne y getMany; no hay escrituras públicas.
const publicAliases: Record<string, string> = {
  businesses: "public/companies",
};

const resolveResource = (resource: string): string =>
  publicAliases[resource] ?? resource;

export const dataProvider: DataProvider = {
  ...jsonProvider,
  getList: (resource, params) =>
    jsonProvider.getList(resolveResource(resource), params),
  getOne: (resource, params) =>
    jsonProvider.getOne(resolveResource(resource), params),
  getMany: (resource, params) =>
    jsonProvider.getMany(resolveResource(resource), params),
};

/* 
export const dataProivedr = jsonServerProvider(
  'http://jsonplaceholder.typicode.com'
);

*/