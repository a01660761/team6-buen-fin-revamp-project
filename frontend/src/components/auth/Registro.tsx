//import { useState } from "react";

export function Registro(){
    // Add the connection with the backend here

    return(
        <form className="flex flex-col gap-5 rounded-3xl bg-[var(--card-background-2)] p-8 text-[var(--button-text-color)]">
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
                    Nombre
                </label>
                <input type="text" id="nombre" name="nombre" placeholder="Ingresa tu nombre" className="w-full rounded-lg border p-4 border-[var(--card-text-color-3)]"/>
            </div>

            <div className="grid gap-2">
                <label htmlFor="apellidos" className="font-bold">
                    Apellidos
                </label>
                <input type="text" id="apellidos" name="apellidos" placeholder="Ingresa tus apellidos" className="w-full rounded-lg border p-4 border-[var(--card-text-color-3)]"/>
            </div>

            <div className="grid gap-2">
                <label htmlFor="telefono" className="font-bold">
                    Teléfono
                </label>
                <input type="tel" id="telefono" name="telefono" placeholder="Ingresa tu número telefónico" className="w-full rounded-lg border p-4 border-[var(--card-text-color-3)]"/>
            </div>

            <div className="grid gap-2">
                <label htmlFor="puesto" className="font-bold">
                    Puesto * 
                </label>
                <select id="puesto" name="puesto" defaultValue="" required className="w-full rounded-lg border p-4 border-[var(--card-text-color-3)]">
                    <option value="" disabled>Selecciona tu puesto</option>
                    <option value="administrador">Administrador</option>
                    <option value="empleado">Propietario/Dueño</option>
                    <option value="cliente">Cliente</option>
                    <option value="otro">Otro cargo</option>
                </select>
            </div>

            <div className="grid gap-2">
                <label htmlFor="email" className="font-bold">
                    Correo Electrónico
                </label>
                <input type="email" id="email" name="email" placeholder="Ingresa tu correo electronico" className="w-full rounded-lg border p-4 border-[var(--card-text-color-3)]"/>
            </div>

            <div className="grid gap-2">
                <label htmlFor="contrasena" className="font-bold">
                    Contraseña
                </label>
                <input type="password" required autoComplete="new-password" id="password" name="password" placeholder="Ingresa tu contraseña" className="w-full rounded-lg border p-4 border-[var(--card-text-color-3)]"/>
            </div>

            <div className="grid gap-2">
                <label htmlFor="confirmation" className="font-bold">
                    Confirmación *
                </label>
                <input type="password" required autoComplete="new-password" id="confirmation" name="confirmation" placeholder="Confirma tu contraseña" className="w-full rounded-lg border p-4 border-[var(--card-text-color-3)]"/>
            </div>

            <div className="my-5 flex items-start gap-3">
                <input id= "terminos" name="terminos" type="checkbox" required className="mt-2 size-8 accent-[var(--card-bottom-color)]"/>
                <label htmlFor="terminos" className="text-m">
                    Al registrarme acepto los {" "}
                    <a href="" className="underline font-bold">
                        Términos y condiciones
                    </a> {" "} y he leído el {" "} 
                    <a href="" className="underline font-bold">
                        Aviso de privacidad
                    </a>
                </label>
            </div>

            <p className="text-center text-m">
                Al momento de registrate para el uso de marca de {" "}
                <a className="font-bold">
                    El Buen Fin
                </a> {" "},también se procesará tu inscripción al {" "}
                <a className="underline font-bold">
                    Sorteo SAT
                </a> {""} en el marco de El Buen Fin para que las compras realizadas
                en tu negocio participante en el sorteo.
            </p>

            <button className="w-full rounded-xl bg-[var(--card-bottom-color)] p-3 font-semibold text-[var(--default-text-color)]">
                Registrarse
            </button>
        </form>
    )
}
