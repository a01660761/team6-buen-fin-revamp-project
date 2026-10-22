import jsonServerProvider from "ra-data-json-server";
import type { DataProvider } from "react-admin";

const jsonProvider = jsonServerProvider(import.meta.env.VITE_JSON_SERVER_URL);

// NUEVO: nombres de la app -> rutas públicas del contrato (docs/api-contract.md, sección 9)
const publicAliases: Record<string, string> = {
  businesses: "public/companies",
  catalogProducts: "public/products",
  catalogOffers: "public/offers",
  vacancies: "public/vacancies", // NUEVO (#43): vacantes públicas
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

/* export const dataProivedr = jsonServerProvider('http://jsonplaceholder.typicode.com'); */