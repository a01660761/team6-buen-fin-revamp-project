/*
* ChatGPT-6.1 Sol was used to review, validate and improve the code.
* NOTE: we use sessionStorage instead of localStorage to store the token, 
* because sessionStorage is cleared when the browser tab is closed, which is a 
* security measure to prevent unauthorized access to the application after the user 
* has logged out or closed the tab.
*/

import type { AuthProvider } from "react-admin";

import {
    API_URL,
    TOKEN_KEY,
    getCurrentUser,
    httpClient,
} from "./apiClient";

export const authProvider: AuthProvider = {
    async login({ username, password }) {
        sessionStorage.removeItem(TOKEN_KEY); // remove any existing token before logging in

        const { json } = await httpClient(
            `${API_URL}/login`,
            {
                method: "POST",
                body: JSON.stringify({
                    email: username,
                    password,
                }),
            }
        ); // send a POST request to the login endpoint with the username and password

        if (typeof json.token !== "string") {
            throw new Error(
                "Respuesta de login inválida."
            );
        }

        sessionStorage.setItem(TOKEN_KEY, json.token); // store the token in sessionStorage
    },

    async logout() {
        try {
            if (sessionStorage.getItem(TOKEN_KEY)) {
                await httpClient(
                    `${API_URL}/logout`,
                    { method: "POST" }
                );
            } // if a token is present, send a POST request to the logout endpoint
        } 
        
        catch {
            console.warn(
                "No se pudo confirmar el cierre de sesión en el servidor."
            );
        } 
        
        finally {
            sessionStorage.removeItem(TOKEN_KEY);
        } // remove the token from sessionStorage regardless of whether the logout request succeeded or failed
    },

    async checkError({ status }: { status: number }) {
        if (status === 401) {
            sessionStorage.removeItem(TOKEN_KEY);

            throw new Error(
                "La sesión terminó. Inicia sesión nuevamente."
            );
        }
    },

    async checkAuth() {
        if (!sessionStorage.getItem(TOKEN_KEY)) {
            throw new Error("Inicia sesión.");
        }

        try {
            await getCurrentUser();
        } catch (error) {
            if (
                (error as { status?: number }).status === 401
            ) {
                sessionStorage.removeItem(TOKEN_KEY);

                throw new Error("La sesión terminó.");
            }

            throw Object.assign(
                new Error(
                    "No se pudo verificar la sesión."
                ),
                { logoutUser: false }
            );
        }
    },

    async getIdentity() {
        const user = await getCurrentUser();

        return {
            id: user.id,
            fullName:
                `${user.firstName} ${user.lastName}`.trim() ||
                user.email,
        };
    },

    async getPermissions() {
        return (await getCurrentUser()).role;
    },

    async canAccess() {
        return (await getCurrentUser()).role === "admin";
    },
};