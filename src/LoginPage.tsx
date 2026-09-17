import { useState } from "react";
import { Login, useLogin, useNotify, useTranslate, } from "react-admin";
import { Box, Button, TextField, Typography, } from "@mui/material";

export const LoginPage = () => {
    const login = useLogin(); // IMPLEMENTED HOOK! #N
    const notification = useNotify();
    const translate = useTranslate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        login({
            username, password, 
        }).catch(() => {
            notification(translate("ra.auth.sign_in_error"), { type: "error" });
        });
    };

    return (
        <Login>
            <Box component="form" onSubmit={handleSubmit} sx={{
                display: "flex", flexDirection: "column", gap: 2, 
                padding: 3, minWidth: 300,
            }}
            >
                <Typography variant="h5">
                    {translate("ra.auth.sign_in")}
                </Typography>

                <TextField 
                    label={translate("ra.auth.username")}
                    value={username} 
                    onChange={(event) => setUsername(event.target.value)} 
                    fullWidth
                />

                <TextField 
                    label={translate("ra.auth.password")}
                    type="password"
                    value={password} 
                    onChange={(event) => setPassword(event.target.value)} 
                    fullWidth
                />

                <Button type="submit" variant="contained" >
                    {translate("ra.auth.sign_in")}
                </Button>

            </Box>
        </Login>
    );
};