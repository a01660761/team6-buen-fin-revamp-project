import { List, DataTable, ReferenceField, 
    EditButton, Edit, SimpleForm, ReferenceInput, 
    TextInput, Create, useNotify, useRefresh, 
    useRedirect, EmailField, SimpleList 
} from "react-admin";
import { useMediaQuery, Theme } from "@mui/material";

export const AlbumList = () => {
    const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));
    return (
        <List>
            {isSmall ? (
               <SimpleList 
                    primaryText={(record) => record.userId}
                    secondaryText={(record) => record.id}
                    tertiaryText={(record) => record.title}
                /> 
            ) : (
                <DataTable>
                    <DataTable.Col source="userId">
                        <ReferenceField source="userId" reference="users" link="edit"/>
                    </DataTable.Col>
                    <DataTable.Col source="id" />
                    <DataTable.Col source="title" />
                    <DataTable.Col>
                        <EditButton />
                    </DataTable.Col>
                </DataTable>
            )}
        </List>
    );
};

export const AlbumEdit = () => (
    <Edit>
        <SimpleForm warnWhenUnsavedChanges>
            <TextInput disabled source="id" />
            <ReferenceInput required source="userId" reference="users" />
            <TextInput required source="title" />
        </SimpleForm>
    </Edit>
);

export const AlbumCreate = () => (
    <Create>
        <SimpleForm>
            <ReferenceInput required source="userId" reference="users" />
            <TextInput required source="title" />
        </SimpleForm>
    </Create>
);