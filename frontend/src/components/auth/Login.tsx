import { useState } from "react";
import { Registro } from "@/components/auth/Registro";

export function Login(){
    // Add the connection with the backend here

    const[mostrarRegistro, setMostrarRegistro] = useState(false);
    if (mostrarRegistro){
        return <Registro/>
    }

    return(
        <form className="flex flex-col gap-5 rounded-3xl bg-[var(--card-background-2)] p-8 text-var(--button-text-color)]">
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
                <input type="email" id="email" name="email" placeholder="Ingresa tu correo electronico" className="w-full rounded-lg border p-4 border-[var(--card-text-color-3)]"/>
            </div>

            <div className="grid gap-2">
                <label htmlFor="contraseña" className="font-bold">
                    Contraseña
                </label>
                <input type="password" required autoComplete="new-password" id="password" name="password" placeholder="Ingresa tu contraseña" className="w-full rounded-lg border p-4 border-[var(--card-text-color-3)]"/>
            </div>

            <p className="text-sm font-medium"> 
                ¿Olvidaste tu contraseña?
            </p>

            <button className="w-full rounded-xl bg-[var(--card-bottom-color)] p-3 font-semibold text-[var(--default-text-color)]">
                Iniciar sesión
            </button>

            <hr className="flex-1 border-[var(--card-bottom-color)]" />
            
            <p className="text-center text-sm font-semibold">
                ¿Aún no tienes una cuenta?
            </p>

            <hr className="flex-1 border-[var(--card-bottom-color)]" />

            <button type="button" onClick={() => {setMostrarRegistro(true)}} className="w-full rounded-xl bg-[var(--card-bottom-color)] p-3 font-semibold text-[var(--default-text-color)]">
                Crear una cuenta
            </button>
            <p className="text-center">
                Después de crear tu cuenta, inicia sesión y registra una o más empresas
            </p>
        </form>
    )
}
