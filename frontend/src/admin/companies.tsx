/**
 * 
 * ChatGPT-6.1 Sol was used to review and edit this code.
 * 
 */

import {
    AutocompleteInput,
    BooleanField,
    BooleanInput,
    Create,
    DataTable,
    Edit,
    EditButton,
    EmailField,
    FormDataConsumer,
    Labeled,
    List,
    ReferenceField,
    ReferenceInput,
    SaveButton,
    SelectInput,
    SimpleForm,
    TextInput,
    Toolbar,
    email,
    maxLength,
    required,
} from "react-admin"; // bring in react-admin components and validators

import { categoryChoices } from "./choices";

function companyPayload(
    values: Record<string, unknown>, // the form values
    creating: boolean
) {
    const data: Record<string, unknown> = {}; // the payload to send to the API

    for (const field of [
        "name",
        "rfc",
        "category",
        "physicalStore",
        "isActive",
        "isHidden",
    ]) {
        data[field] = values[field];
    } // copy the values of the fields to the payload

    for (const field of [
        "description",
        "address",
        "contactEmail",
        "contactPhone",
        "websiteUrl",
    ]) {
        const value = values[field];

        if (typeof value === "string" && value.trim()) {
            data[field] = value.trim();
        }  // if the value is a non-empty string, trim it and add it to the payload
        
        else if (!creating) {
            data[field] = null;
        } // if the value is empty and we are editing, set it to null
    }

    if (creating) {
        data.ownerUserId = values.ownerUserId;
    } // if we are creating a new company, add the ownerUserId to the payload

    return data;
}

const CompanyToolbar = () => (
    <Toolbar>
        <SaveButton />
    </Toolbar>
);

const CompanyInputs = () => (
    <>
        <TextInput
            source="name"
            label="Nombre comercial"
            validate={[required(), maxLength(200)]}
        />

        <TextInput
            source="rfc"
            label="RFC"
            validate={[required(), maxLength(13)]}
            helperText="Identificador fiscal; no acredita validación oficial."
        />

        <SelectInput
            source="category"
            label="Categoría"
            choices={categoryChoices}
            validate={required()}
        />

        <BooleanInput
            source="physicalStore"
            label="Tiene tienda física"
        />

        <FormDataConsumer>
            {({ formData }) => (
                <TextInput
                    source="address"
                    label="Dirección"
                    validate={
                        formData.physicalStore ? [required(), maxLength(500)] : maxLength(500)
                    } // if physicalStore is true, address is required; otherwise, it's optional
                />
            )}
        </FormDataConsumer>

        <TextInput
            source="description"
            label="Descripción"
            multiline
            validate={maxLength(5000)}
        />

        <TextInput
            source="contactEmail"
            label="Correo de contacto"
            type="email"
            validate={email()}
        />

        <TextInput
            source="contactPhone"
            label="Teléfono de contacto"
            validate={maxLength(30)}
        />

        <TextInput
            source="websiteUrl"
            label="Sitio web"
            type="url"
            validate={maxLength(2048)}
        />

        <BooleanInput
            source="isActive"
            label="Activa"
        />

        <BooleanInput
            source="isHidden"
            label="Oculta por moderación interna"
            helperText="Control de visibilidad dentro de este portal."
        />
    </>
); // contains all the input fields for the company form, with validation and conditional logic for the 
// address field, based on whether the company has a physical store or not

export const AdminCompanyList = () => (
    <List
        title="Administrar empresas"
        exporter={false} // disable export button
        sort={{ field: "name", order: "ASC" }}
        filters={[
            <TextInput
                key="q"
                source="q"
                label="Buscar empresa"
                alwaysOn
            />, // search input for company name
        ]}
    >
        <DataTable
            bulkActionButtons={false}
            rowClick="edit"
        >
            <DataTable.Col
                source="name"
                label="Empresa"
            />

            <DataTable.Col
                source="category"
                label="Categoría"
            />

            <DataTable.Col
                source="ownerUserId"
                label="Representante"
                disableSort // disable sorting for this column since it's a reference field
            >
                <ReferenceField
                    source="ownerUserId"
                    reference="users"
                    link={false}
                >
                    <EmailField source="email" />
                </ReferenceField>
            </DataTable.Col>

            <DataTable.Col
                source="isActive"
                label="Activa"
                disableSort
            >
                <BooleanField source="isActive" />
            </DataTable.Col>

            <DataTable.Col
                source="isHidden"
                label="Oculta"
                disableSort
            >
                <BooleanField source="isHidden" />
            </DataTable.Col>

            <DataTable.Col>
                <EditButton />
            </DataTable.Col>
        </DataTable>
    </List>
); // basically a list view for companies, with a search input, sortable columns, and an edit button for each row

export const AdminCompanyCreate = () => (
    <Create
        title="Crear empresa"
        redirect="list"
        transform={(values) => companyPayload(values, true)} // transform the form values into the payload for the API
    >
        <SimpleForm
            defaultValues={{
                physicalStore: false,
                isActive: false,
                isHidden: false,
            }}
            toolbar={<CompanyToolbar />} // use the custom toolbar with the save button
        >
            <ReferenceInput
                source="ownerUserId"
                reference="users"
                filter={{
                    role: "business",
                    isActive: true,
                }}
                sort={{ field: "email", order: "ASC" }}
            >
                <AutocompleteInput
                    label="Representante"
                    optionText="email"
                    validate={required()}
                />
            </ReferenceInput>

            <CompanyInputs />
        </SimpleForm>
    </Create>
);

export const AdminCompanyEdit = () => (
    <Edit
        title="Editar empresa"
        mutationMode="pessimistic" // use "pessimistic mutation" mode is to avoid any optimistic updates (i.e., the UI will wait for the server response before updating)
        redirect="list"
        transform={(values) => companyPayload(values, false)} // transform the form values into the payload for the API
    >
        <SimpleForm toolbar={<CompanyToolbar />}>
            <Labeled label="Representante">
                <ReferenceField
                    source="ownerUserId"
                    reference="users"
                    link={false}
                >
                    <EmailField source="email" />
                </ReferenceField>
            </Labeled>

            <CompanyInputs />
        </SimpleForm>
    </Edit>
); // a create and edit view for companies, with a custom toolbar, form inputs, and validation