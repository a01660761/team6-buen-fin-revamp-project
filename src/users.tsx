import { List, DataTable, ReferenceField, 
    EditButton, Edit, SimpleForm, ReferenceInput, 
    TextInput, BooleanField, BooleanInput, Create, useNotify, useRefresh, 
    useRedirect, EmailField, SimpleList 
} from "react-admin";

// export const UserList = () => (
//     <List>
//         <DataTable>
//             <DataTable.Col source="id" />
//             <DataTable.Col source="name" />
//             <DataTable.Col source="username" />
//             <DataTable.Col source="email" >
//                 <EmailField source="email" />
//             </DataTable.Col>
//             <DataTable.Col source="address.street" />
//             <DataTable.Col source="phone" />
//             <DataTable.Col source="website" />
//             <DataTable.Col source="company.name" />
//         </DataTable>
//     </List>
// );

/* export const UserList = () => (
    <List>
        <SimpleList 
            primaryText={(record) => record.name}
            secondaryText={(record) => record.username}
            tertiaryText={(record) => record.email}
        />
    </List>
); */

import { useMediaQuery, Theme } from "@mui/material";

export const UserList = () => {
    const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));
    return (
        <List>
            {isSmall ? (
               <SimpleList 
                    primaryText={(record) => record.name}
                    secondaryText={(record) => record.username}
                    tertiaryText={(record) => record.email}
                /> 
            ) : (
                <DataTable>
                    <DataTable.Col source="id" />
                    <DataTable.Col source="name" />
                    <DataTable.Col source="username" />
                    <DataTable.Col source="email" >
                        <EmailField source="email" />
                    </DataTable.Col>
                    <DataTable.Col source="address.street" />
                    <DataTable.Col source="phone" />
                    <DataTable.Col source="website" />
                    <DataTable.Col source="company.name" />
                    <DataTable.Col>
                        <EditButton />
                    </DataTable.Col>
                </DataTable>
            )}
        </List>
    );
};

export const UserEdit = () => (
    <Edit>
        <SimpleForm warnWhenUnsavedChanges>
            <TextInput disabled source="id" />
            <TextInput required source="name" />
            <TextInput required source="username" />
            <TextInput required source="email" type="email" />
            <TextInput source="address.street" />
            <TextInput source="phone" />
            <TextInput source="website" />
            <TextInput source="company.name" />
        </SimpleForm>
    </Edit>
);

export const UserCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput required source="name" />
            <TextInput required source="username" />
            <TextInput required source="email" type="email" />
            <TextInput source="address.street" />
            <TextInput source="phone" />
            <TextInput source="website" />
            <TextInput source="company.name" />
        </SimpleForm>
    </Create>
);

