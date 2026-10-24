/**
 * ChatGPT-6.1 Sol was used to review, validate and improve the code.
*/

// import { useState } from "react";
import { useState, type FormEvent } from "react";
import { authProvider } from "@/AuthProvider";
import { getCurrentUser, TOKEN_KEY } from "@/apiClient";
import { Registro } from "@/components/auth/Registro";

/*
ChatGPT-6 Luna se utilizo para lo siguiente:
- prevent.Default : Para evitar que el navegador recargue la página cuando presionas <<Iniciar Sesión>>
- Mejorar la accesibilidad y corrección Tailwind
*/

export function Login(){
    // Funcion que nos redirige a registro si es verdadero
    const[mostrarRegistro, setMostrarRegistro] = useState(false);
    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState("");

    async function iniciarSesion(event: FormEvent<HTMLFormElement>) {
        event.preventDefault(); // prevent the default form submission behavior

        if (enviando) return;

        const datos = new FormData(event.currentTarget);

        setError("");
        setEnviando(true);

        try {
            await authProvider.login({
                username: String(datos.get("email") ?? "").trim().toLowerCase(),
                password: String(datos.get("password") ?? ""),
            });

            const usuario = await getCurrentUser();

            window.location.assign(
                usuario.role === "admin" ? "/admin" : "/empresas"
            );

        } 
        
        catch (errorRecibido) {
            const estado = (
                errorRecibido as { status?: number }
            ).status;

            if (estado === 401) {
                sessionStorage.removeItem(TOKEN_KEY);
                setError("El correo o la contraseña son incorrectos.");
            } 
            
            else if (estado === 400) {
                setError("Revisa el correo y la contraseña ingresados.");
            } 
            
            else {
                setError(
                    "No pudimos completar el inicio de sesión. Intenta nuevamente."
                );
            }
        } 
        
        finally {
            setEnviando(false);
        } // finally block to reset the sending state
    }

    if (mostrarRegistro){
        return <Registro/>
    } // if mostrarRegistro is true, render the Registro component

    return(
        <form  onSubmit={iniciarSesion}
        className="flex w-full min-w-0 flex-col gap-5 rounded-3xl bg-[var(--card-background-2)] p-5 text-[var(--button-text-color)] sm:p-8">
            <h2 className="text-center text-3xl font-bold"> 
                Accede al registro de empresas
            </h2>
            <hr className="border-[var(--card-bottom-color)]"/>
            
            <p className="text-sm font-medium">
                Para registrar una empresa necesitamos una cuenta en el sitio de El Buen Fin.
            </p>

            
            <div className="grid gap-2 ">
                <label htmlFor="email" className="font-bold">
                    Correo Electrónico
                </label>
                <input type="email" id="email" name="email" autoComplete="email" required placeholder="Ingresa tu correo electronico" className="w-full rounded-lg border p-4 border-[var(--card-text-color-3)]"/>
            </div>

            <div className="grid gap-2">
                <label htmlFor="password" className="font-bold">
                    Contraseña
                </label>
                <input type="password" required autoComplete="current-password" id="password" name="password" placeholder="Ingresa tu contraseña" className="w-full rounded-lg border p-4 border-[var(--card-text-color-3)]"/>
            </div>

            <p className="text-sm font-medium"> 
                ¿Olvidaste tu contraseña?
            </p>

            {error && (
                <p role="alert" className="font-semibold">
                    {error}
                </p> 
            )} {/* if 'error' is not empty, display the error message */}

            <button type="submit" className="min-h-11 w-full rounded-xl bg-[var(--card-bottom-color)] p-3 font-semibold text-[var(--default-text-color)] focus-visible:outline-2 focus-visible:outline-offset-4" disabled={enviando}>
                {enviando ? "Iniciando sesión…" : "Iniciar sesión"}
            </button> {/* button text changes based on 'enviando' state */}

            <hr className="flex-1 border-[var(--card-bottom-color)]" />
            
            <p className="text-center text-sm font-semibold">
                ¿Aún no tienes una cuenta?
            </p>

            <hr className="flex-1 border-[var(--card-bottom-color)]" />

            <button type="button" onClick={() => {setMostrarRegistro(true)}} className="min-h-11 w-full rounded-xl bg-[var(--card-bottom-color)] p-3 font-semibold text-[var(--default-text-color)] focus-visible:outline-2 focus-visible:outline-offset-4">
                Crear una cuenta
            </button>
            <p className="text-center">
                Después de crear tu cuenta, inicia sesión y registra una o más empresas
            </p>
        </form>
    )
}
