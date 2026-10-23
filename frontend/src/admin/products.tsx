/*
 * 
 * ChatGPT-6.1 Sol was used to review and edit this code.
 * This code is part of the admin interface for managing products 
 * in the app.
 */


import {
    AutocompleteInput,
    BooleanField,
    BooleanInput,
    Create,
    DataTable,
    Edit,
    EditButton,
    Labeled,
    List,
    ReferenceField,
    ReferenceInput,
    SaveButton,
    SelectInput,
    SimpleForm,
    TextField,
    TextInput,
    Toolbar,
    maxLength,
    required,
} from "react-admin";

import { categoryChoices } from "./choices";
import { PriceField, PriceInput } from "./Price";


function productPayload(
    values: Record<string, unknown>,
    creating: boolean
) {
    const data: Record<string, unknown> = {
        currency: "MXN",
    };

    for (const field of [
        "name",
        "description",
        "category",
        "priceCents",
        "isActive",
        "isHidden",
    ]) {
        data[field] = values[field];
    } // copy the values of the fields to the payload

    if (creating) {
        data.companyId = values.companyId;
    }

    const imageUrl = values.imageUrl;

    if (typeof imageUrl === "string" && imageUrl.trim()) {
        data.imageUrl = imageUrl.trim();
    } 
    
    else if (!creating) {
        data.imageUrl = null;
    }

    return data;
}

const ProductToolbar = () => (
    <Toolbar>
        <SaveButton />
    </Toolbar>
);

const ProductInputs = () => (
    <>
        <TextInput
            source="name"
            label="Nombre"
            validate={[required(), maxLength(200)]}
        />

        <TextInput
            source="description"
            label="Descripción"
            multiline
            validate={[required(), maxLength(5000)]}
        />

        <SelectInput
            source="category"
            label="Categoría"
            choices={categoryChoices}
            validate={required()}
        />

        <PriceInput />

        <TextInput
            source="imageUrl"
            label="URL de la imagen"
            type="url"
            validate={maxLength(2048)}
        />

        <BooleanInput
            source="isActive"
            label="Activo"
        />

        <BooleanInput
            source="isHidden"
            label="Oculto por moderación interna"
        />
    </>
);

export const AdminProductList = () => (
    <List
        title="Administrar productos"
        exporter={false}
        sort={{ field: "name", order: "ASC" }}
        filters={[
            <TextInput
                key="q"
                source="q"
                label="Buscar producto"
                alwaysOn
            />,
        ]} // search input for product name
    >
        <DataTable
            bulkActionButtons={false}
            rowClick="edit"
        >
            <DataTable.Col
                source="name"
                label="Producto"
            />

            <DataTable.Col
                source="companyId"
                label="Empresa"
                disableSort
            >
                <ReferenceField
                    source="companyId"
                    reference="companies"
                    link={false}
                >
                    <TextField source="name" />
                </ReferenceField>
            </DataTable.Col>

            <DataTable.Col
                source="category"
                label="Categoría"
            />

            <DataTable.Col
                source="priceCents"
                label="Precio (MXN)"
            >
                <PriceField />
            </DataTable.Col>

            <DataTable.Col
                source="isActive"
                label="Activo"
                disableSort
            >
                <BooleanField source="isActive" />
            </DataTable.Col>

            <DataTable.Col
                source="isHidden"
                label="Oculto"
                disableSort
            >
                <BooleanField source="isHidden" />
            </DataTable.Col>

            <DataTable.Col>
                <EditButton />
            </DataTable.Col>
        </DataTable>
    </List>
);

export const AdminProductCreate = () => (
    <Create
        title="Crear producto"
        redirect="list"
        transform={(values) =>
            productPayload(values, true)
        }
    >
        <SimpleForm
            defaultValues={{
                isActive: false,
                isHidden: false,
            }}
            toolbar={<ProductToolbar />}
        >
            <ReferenceInput
                source="companyId"
                reference="companies"
                sort={{ field: "name", order: "ASC" }}
            >
                <AutocompleteInput
                    label="Empresa"
                    optionText="name"
                    validate={required()}
                />
            </ReferenceInput>

            <ProductInputs />
        </SimpleForm>
    </Create>
);

export const AdminProductEdit = () => (
    <Edit
        title="Editar producto"
        redirect="list"
        mutationMode="pessimistic"
        transform={(values) =>
            productPayload(values, false)
        }
    >
        <SimpleForm toolbar={<ProductToolbar />}>
            <Labeled label="Empresa">
                <ReferenceField
                    source="companyId"
                    reference="companies"
                    link={false}
                >
                    <TextField source="name" />
                </ReferenceField>
            </Labeled>

            <ProductInputs />
        </SimpleForm>
    </Edit>
);