/**
 * 
 * ChatGPT-6.1 Sol was used to review, validate and improve the code.
 * 
 */

import {
    Admin,
    BooleanField,
    DataTable,
    DateField,
    List,
    Resource,
} from "react-admin";

import { authProvider } from "../AuthProvider";
import { dataProvider } from "../dataProvider";
import { LoginPage } from "../LoginPage";

import {
    AdminCompanyList,
    AdminCompanyCreate,
    AdminCompanyEdit,
} from "./companies";

import {
    AdminProductList,
    AdminProductCreate,
    AdminProductEdit,
} from "./products";

import { PriceField } from "./Price";

const OfferList = () => (
    <List
        title="Ofertas"
        exporter={false}
        sort={{ field: "endsAt", order: "ASC" }}
    >
        <DataTable bulkActionButtons={false}>
            <DataTable.Col
                source="title"
                label="Oferta"
            />

            <DataTable.Col
                source="priceCents"
                label="Precio (MXN)"
            >
                <PriceField />
            </DataTable.Col>

            <DataTable.Col
                source="endsAt"
                label="Finaliza"
            >
                <DateField
                    source="endsAt"
                    showTime
                />
            </DataTable.Col>

            <DataTable.Col
                source="isActive"
                label="Activa"
                disableSort
            >
                <BooleanField source="isActive" />
            </DataTable.Col>
        </DataTable>
    </List>
);

export const AdminPanel = () => (
    <Admin
        basename="/admin"
        dataProvider={dataProvider}
        authProvider={authProvider}
        loginPage={LoginPage}
        requireAuth
    >
        <Resource
            name="companies"
            options={{ label: "Empresas" }}
            list={AdminCompanyList}
            create={AdminCompanyCreate}
            edit={AdminCompanyEdit}
            recordRepresentation="name"
        />

        <Resource
            name="products"
            options={{ label: "Productos" }}
            list={AdminProductList}
            create={AdminProductCreate}
            edit={AdminProductEdit}
            recordRepresentation="name"
        />

        <Resource
            name="offers"
            options={{ label: "Ofertas" }}
            list={OfferList}
        />

        <Resource
            name="users"
            recordRepresentation="email"
        />
    </Admin>
);
