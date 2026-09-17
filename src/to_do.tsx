import { List, DataTable, ReferenceField, 
    EditButton, Edit, SimpleForm, ReferenceInput, 
    TextInput, BooleanField, BooleanInput, Create, useNotify, useRefresh, 
    useRedirect, EmailField, SimpleList, SelectInput 
} from "react-admin";
import { useMediaQuery, Theme } from "@mui/material";

const toDoFilters = [
    <SelectInput source="completed" label="Completado" choices={[
        { id: true, name: "Sí" },
        { id: false, name: "No" }
    ]}
    />
];

export const ToDoList = () => {
    const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));
    return (
        <List filters={toDoFilters}>
            {isSmall ? (
               <SimpleList 
                    primaryText={(record) => record.userId}
                    secondaryText={(record) => record.title}
                    tertiaryText={(record) => record.completed ? "Completed" : "Not Completed"}
                /> 
            ) : (
                <DataTable>
                    <DataTable.Col source="userId">
                        <ReferenceField source="userId" reference="users" link="edit" />
                    </DataTable.Col>
                    <DataTable.Col source="id" />
                    <DataTable.Col source="title" />
                    <DataTable.Col source="completed">
                        <BooleanField source="completed" />
                    </DataTable.Col>
                    <DataTable.Col>
                        <EditButton />
                    </DataTable.Col>
                </DataTable>
            )}
        </List>
    );
};

export const ToDoEdit = () => (
    <Edit>
        <SimpleForm warnWhenUnsavedChanges>
            <TextInput disabled source="id" />
            <ReferenceInput required source="userId" reference="users" />
            <TextInput required source="title" />
            <BooleanInput source="completed" />
        </SimpleForm>
    </Edit>
);

export const ToDoCreate = () => (
    <Create>
        <SimpleForm>
            <ReferenceInput required source="userId" reference="users" />
            <TextInput required source="title" />
            <BooleanInput source="completed" />
        </SimpleForm>
    </Create>
);

