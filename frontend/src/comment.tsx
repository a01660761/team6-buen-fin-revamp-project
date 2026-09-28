import { List, DataTable, ReferenceField, 
    EditButton, Edit, SimpleForm, ReferenceInput, 
    TextInput, Create, useNotify, useRefresh, 
    useRedirect, EmailField, SimpleList 
} from "react-admin";
import { useMediaQuery, Theme } from "@mui/material";

export const CommentList = () => {
    const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));
    return (
        <List>
            {isSmall ? (
               <SimpleList 
                    primaryText={(record) => record.postId}
                    secondaryText={(record) => record.name}
                    tertiaryText={(record) => record.body}
                /> 
            ) : (
                <DataTable>
                    <DataTable.Col source="postId">
                        <ReferenceField source="postId" reference="posts" link="edit" />
                    </DataTable.Col>
                    <DataTable.Col source="id" />
                    <DataTable.Col source="name" />
                    <DataTable.Col source="email">
                        <EmailField source="email" />
                    </DataTable.Col>
                    <DataTable.Col source="body" />
                    <DataTable.Col>
                        <EditButton />
                    </DataTable.Col>
                </DataTable>
            )}
        </List>
    );
};

export const CommentEdit = () => (
    <Edit>
        <SimpleForm warnWhenUnsavedChanges>
            <TextInput disabled source="id" />
            <ReferenceInput required source="postId" reference="posts" />
            <TextInput required source="name" />
            <TextInput required source="body" multiline rows={5} />
        </SimpleForm>
    </Edit>
);

export const CommentCreate = () => (
    <Create>
        <SimpleForm>
            <ReferenceInput required source="postId" reference="posts" />
            <TextInput required source="name" />
            <TextInput required source="email" type="email" />
            <TextInput required source="body" multiline rows={5} />
        </SimpleForm>
    </Create>
);

