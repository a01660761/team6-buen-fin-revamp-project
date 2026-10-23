/**
 * 
 * ChatGPT-6.1 Sol was used to review and edit this code.
 * This is the main entry point for the admin interface of the app, 
 * which allows users to manage products and companies.
 * 
 */

import { fetchUtils } from "react-admin";

export const API_URL = (
    import.meta.env.VITE_JSON_SERVER_URL ??
    "http://localhost:3000"
).replace(/\/+$/, ""); // remove trailing slashes from the URL

export const TOKEN_KEY = "buenfin.token";

export const httpClient = (
    url: string,
    options: fetchUtils.Options = {}
) => {
    const headers = new Headers(options.headers); // create a new Headers object from the options.headers
    headers.set("Accept", "application/json");

    const token = sessionStorage.getItem(TOKEN_KEY);

    if (token && url.startsWith(`${API_URL}/`)) {
        headers.set("Authorization", `Bearer ${token}`);
    }// set the Authorization header if a token is present and the URL is for the API

    return fetchUtils.fetchJson(url, {
        ...options,
        headers,
    });
};

export async function getCurrentUser() {
    const { json } = await httpClient(
        `${API_URL}/users/me`
    ); // fetch the current user from the API

    return json as {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: "admin" | "business";
    };
}