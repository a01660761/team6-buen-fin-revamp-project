import { List, DataTable, ReferenceField, 
    EditButton, Edit, SimpleForm, ReferenceInput, 
    TextInput, Create, useNotify, useRefresh, 
    useRedirect, EmailField, SimpleList, ImageField 
} from "react-admin";
import { useMediaQuery, Theme } from "@mui/material";

export const PhotoList = () => {
    const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));
    return (
        <List>
            {isSmall ? (
               <SimpleList 
                    primaryText={(record) => record.albumId}
                    secondaryText={(record) => record.title}
                    tertiaryText={(record) => record.thumbnailUrl}
                /> 
            ) : (
                <DataTable>
                    <DataTable.Col source="albumId">
                        <ReferenceField source="albumId" reference="albums" link="edit" />
                    </DataTable.Col>
                    <DataTable.Col source="id" />
                    <DataTable.Col source="title" />
                    <DataTable.Col source="url" />
                    <DataTable.Col source="thumbnailUrl">
                        <ImageField source="thumbnailUrl" />
                    </DataTable.Col>
                    <DataTable.Col>
                        <EditButton />
                    </DataTable.Col>
                </DataTable>
            )}
        </List>
    );
};

export const PhotoEdit = () => (
    <Edit>
        <SimpleForm warnWhenUnsavedChanges>
            <TextInput disabled source="id" />
            <ReferenceInput required source="albumId" reference="albums" />
            <TextInput required source="title" />
            <TextInput required source="url" />
            <TextInput required source="thumbnailUrl" />
        </SimpleForm>
    </Edit>
);

export const PhotoCreate = () => (
    <Create>
        <SimpleForm>
            <ReferenceInput required source="albumId" reference="albums" />
            <TextInput required source="title" />
            <TextInput required source="url" />
            <TextInput required source="thumbnailUrl" />
        </SimpleForm>
    </Create>
);