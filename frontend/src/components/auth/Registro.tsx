//import { useState } from "react";
import { Avisos } from "@/components/layout/avisos";
import { useState, type FormEvent } from "react";
import { API_URL, httpClient } from "@/apiClient"; // connect with the backend

/*
ChatGPT-6 Luna se utilizo para lo siguiente:
- Mejorar la accesibilidad y corrección Tailwind
- Analizo que me faltaron los "required" en los registros, una mala asiganacipn en el htmlFor
- Mejorar el codigo de <a> -> <span>
---------
- [&_buttom]:font-bold y [&_button]:underline : Aplican estilos a los botones dentro de mi elemento padre
- focus : es para el enfoque mediante teclado
*/


export function Registro(){
    const [enviando, setEnviando] = useState(false); // set this state to true when the form is being submitted
    const [error, setError] = useState(""); // error message to display if the form submission fails
    const [mensaje, setMensaje] = useState("");

    async function registrarCuenta(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (enviando) return; // prevent multiple submissions

        setError("");
        setMensaje("");

        const formulario = event.currentTarget;
        const datos = new FormData(formulario);

        // validation for password and confirmation
        const password = String(datos.get("password") ?? "");
        const confirmacion = String(datos.get("confirmation") ?? "");

        if (password !== confirmacion) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        if (!datos.has("terminos")) {
            setError("Debes aceptar los términos para registrarte!");
            return;
        }

        const telefono = String(datos.get("telefono") ?? "").trim();

        setEnviando(true);

        try {
            await httpClient(`${API_URL}/registrarse`, {
                method: "POST",
                body: JSON.stringify({
                    firstName: String(datos.get("nombre") ?? "").trim(),
                    lastName: String(datos.get("apellidos") ?? "").trim(),
                    email: String(datos.get("email") ?? "").trim().toLowerCase(),
                    password,
                    ...(telefono ? { phone: telefono } : {}),
                }),
            });

            formulario.reset();
            setMensaje("Cuenta creada correctamente.");
        } 
        
        catch (errorRecibido) {
            const estado = (
                errorRecibido as { status?: number }
            ).status; // get the status code from the error object

            if (estado === 409) {
                setError("Ya existe una cuenta con ese correo.");
            }
            
            else if (estado === 400) {
                setError(
                    "Revisa los campos. La contraseña debe tener entre 12 y 128 caracteres."
                );
            } 
            
            else {
                setError(
                    "No pudimos crear la cuenta. Intenta nuevamente."
                );
            }
        } 
        
        finally {
            setEnviando(false);
        } // reset the sending state
    }

    return(
        <form onSubmit={registrarCuenta} // handle form submission
        className="flex w-full min-w-0 flex-col gap-5 rounded-3xl bg-[var(--card-background-2)] p-5 text-[var(--button-text-color)] sm:p-8">
            <h2 className="text-center text-3xl font-bold"> 
                Registrarse
            </h2>
            <hr className="border-[var(--card-bottom-color)]"/>
            
            <p className="text-sm font-medium">
                Para registrarte, ingresa tu información en los siguientes campos.
                <br/>
                Los campos marcados con un asterisco * son obligatorios.
            </p>

            <div className="grid gap-2">
                <label htmlFor="nombre" className="font-bold">
                    Nombre*
                </label>
                <input type="text" id="nombre" name="nombre" required maxLength={100} autoComplete="given-name" placeholder="Ingresa tu nombre" className="w-full rounded-lg border p-4 border-[var(--card-text-color-3)]"/>
            </div>

            <div className="grid gap-2">
                <label htmlFor="apellidos" className="font-bold">
                    Apellidos*
                </label>
                <input type="text" id="apellidos" name="apellidos" required maxLength={100} autoComplete="family-name" placeholder="Ingresa tus apellidos" className="w-full rounded-lg border p-4 border-[var(--card-text-color-3)]"/>
            </div>

            <div className="grid gap-2">
                <label htmlFor="telefono" className="font-bold">
                    Teléfono*
                </label>
                <input type="tel" id="telefono" name="telefono" autoComplete="tel" required maxLength={32} placeholder="Ingresa tu número telefónico" className="w-full rounded-lg border p-4 border-[var(--card-text-color-3)]"/>
            </div>

            <div className="grid gap-2">
                <label htmlFor="email" className="font-bold">
                    Correo Electrónico *
                </label>
                <input type="email" id="email" name="email" required autoComplete="email" maxLength={250} placeholder="Ingresa tu correo electronico" className="w-full rounded-lg border p-4 border-[var(--card-text-color-3)]"/>
            </div>

            <div className="grid gap-2">
                <label htmlFor="password" className="font-bold">
                    Contraseña *
                </label>
                <input type="password" required  minLength={8} maxLength={128} autoComplete="new-password" id="password" name="password" placeholder="Ingresa tu contraseña" className="w-full rounded-lg border p-4 border-[var(--card-text-color-3)]"/>
            </div>

            <div className="grid gap-2">
                <label htmlFor="confirmation" className="font-bold">
                    Confirmación *
                </label>
                <input type="password" required autoComplete="new-password" id="confirmation" name="confirmation" placeholder="Confirma tu contraseña" className="w-full rounded-lg border p-4 border-[var(--card-text-color-3)]"/>
            </div>

            <div className="my-5 flex items-start gap-3">
                <div className="my-5 flex items-start gap-3">
                    <input id="terminos" name="terminos" type="checkbox" required
                    aria-label="Al registrarme acepto los términos y condiciones y he leído el aviso de privacidad"
                    className="mt-1 size-6 shrink-0 accent-[var(--card-bottom-color)] focus-visible:outline-2 focus-visible:outline-offset-2"/>
                    <div className="min-w-0 text-base leading-relaxed">
                        <label htmlFor="terminos" className="text-m">
                            Al registrarme acepto los {" "}
                        </label>
                        <span className="[&_button]:font-bold [&_button]:underline">
                            <Avisos tipo="terminos" />
                        </span>
                        <span> y he leído el </span>
                        <span className="[&_button]:font-bold [&_button]:underline">
                            <Avisos tipo="privacidad" />
                        </span>
                    </div>
                </div>
            </div>

            <p className="text-center text-m">
                Esta cuenta te permitirá registrar y administrar tus empresas
                dentro de este portal.
            </p>

            {error && (
                <p role="alert" className="font-semibold">
                    {error}
                </p>
            )} {/* display error message if there is one */}

            {mensaje && (
                <p role="status" className="font-semibold">
                    {mensaje}
                </p>
            )} {/* display success message if there is one */}

            <button type="submit" className="min-h-11 w-full rounded-xl bg-[var(--card-bottom-color)] p-3 font-semibold text-[var(--default-text-color)] focus-visible:outline-2 focus-visible:outline-offset-4" disabled={enviando}>
                {enviando ? "Creando cuenta…" : "Registrarse"}
            </button>
        </form>
    )
}
