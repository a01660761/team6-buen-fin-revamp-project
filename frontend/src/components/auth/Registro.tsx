import { useState } from "react";

export function Registro(){
    // Add the connection with the backend here

    return(
        <form className="flex flex-col gap-5 rounded-3xl bg-[var(--card-background)] p-8 text-[var(--default-text-color-2)]">
            <h2 className="text-center text-3x1 font-bold"> 
                Registrarse
            </h2>
            <hr className="border-[var(--card-bottom-color)]"/>
            
            <p className="text-sm font-medium">
                Para registrarte, ingresa tu información en los siguientes campos.
                <br/>
                Los campos marcados con un asterisco * son obligatorios.
            </p>

            <div className="grid gap-2">
                <label htmlFor="nombre" className="font-semibold">
                    Nombre
                </label>
                <input type="text" id="nombre" name="nombre" placeholder="Ingresa tu nombre" className="w-full rounded-lg border p-3"/>
            </div>

            <div className="grid gap-2">
                <label htmlFor="apellido" className="font-semibold">
                    Apellidos
                </label>
                <input type="text" id="apellido" name="apellido" placeholder="Ingresa tu apellido" className="w-full roundend-lg border p-3"/>
            </div>

            <div className="grid gap-2">
                <label htmlFor="telefono" className="font-semibold">
                    Teléfono
                </label>
                <input type="tel" id="telefono" name="telefono" placeholder="Ingresa tu número telefónico" className="w-full rounded-lg border p-3"/>
            </div>

            <div className="grid gap-2">
                <label htmlFor="puesto" className="font-semibold">
                    Puesto * 
                </label>
                <select id="puesto" name="puesto" defaultValue="" required className="w-full rounded-lg border p-3">
                    <option value="" disabled>Selecciona tu puesto</option>
                    <option value="administrador">Administrador</option>
                    <option value="empleado">Propietario/Dueño</option>
                    <option value="cliente">Cliente</option>
                    <option value="otro">Otro cargo</option>
                </select>
            </div>

            <div className="grid gap-2">
                <label htmlFor="email" className="font-semibold">
                    Correo Electrónico
                </label>
                <input type="email" id="email" name="email" placeholder="Ingresa tu correo electronico" className="w-full rounded-lg border p-3"/>
            </div>

            <div className="grid gap-2">
                <label htmlFor="contrasena" className="font-semibold">
                    Contraseña
                </label>
                <input type="password" required autoComplete="new-password" id="password" name="password" placeholder="Ingresa tu contraseña" className="w-full rounded-lg border p-3"/>
            </div>

            <div className="grid gap-2">
                <label htmlFor="confirmation" className="font-semibold">
                    Confirmación *
                </label>
                <input type="password" required autoComplete="new-password" id="confirmation" name="confirmation" placeholder="Confirma tu contraseña" className="w-full rounded-lg border p-3"/>
            </div>

            <div className="my-4 flex items-start gap-3">
                <input id= "terminos" name="terminos" type="checkbox" required className="mt-1 size-5 accent-[var(--card-bottom-color)]"/>
                <label htmlFor="terminos" className="text-sm">
                    Al registrarme acepto los {" "}
                    <a href="" className="underline">
                        Términos y condiciones
                    </a> {" "} y he leído el {" "} 
                    <a href="" className="underline">
                        Aviso de privacidad
                    </a>
                </label>
            </div>

            <p className="text-center text-xs">
                Al momento de registrate para el uso de marca de "El Buen Fin", también se procesará 
                tu inscripción al Sorteo SAT en el marco de "El Buen Fin" para que las compras realizadas
                en tu negocio participante en el sorteo.
            </p>

            <button className="w-full rounded-xl bg-[var(--card-bottom-color)] p-3 font-semibold text-[var(--default-text-color)]">
                Registrarse
            </button>
        </form>
    )
}
