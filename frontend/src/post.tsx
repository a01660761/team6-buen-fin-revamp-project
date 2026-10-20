import { List, DataTable, ReferenceField,
    EditButton, Edit, SimpleForm, ReferenceInput,
    TextInput, Create, SimpleList
} from "react-admin";
import { useMediaQuery, Theme } from "@mui/material";

export const PostList = () => {
    const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));
    return (
        <List>
            {isSmall ? (
               <SimpleList
                    primaryText={(record) => record.userId}
                    secondaryText={(record) => record.title}
                    tertiaryText={(record) => record.body}
                />
            ) : (
                <DataTable>
                    <DataTable.Col source="id" />
                    <DataTable.Col source="userId">
                        <ReferenceField source="userId" reference="users" link="show"/>
                    </DataTable.Col>
                    <DataTable.Col source="title" />
                        <DataTable.Col>
                            <EditButton />
                        </DataTable.Col>
                    <DataTable.Col source="body" />
                </DataTable>
            )}
        </List>
    );
};

export const PostEdit = () =>(
    <Edit>
        <SimpleForm warnWhenUnsavedChanges>
            <TextInput disabled source="id" />
            <ReferenceInput source="userId" reference="users" />
            <TextInput required source="title" />
            <TextInput source="body" />
        </SimpleForm>
    </Edit>
);

export const PostCreate = () => (
    <Create>
        <SimpleForm>
            <ReferenceInput required source="userId" reference="users" />
            <TextInput required source="title" />
            <TextInput required source="body" multiline rows={5} />
        </SimpleForm>
    </Create>
);