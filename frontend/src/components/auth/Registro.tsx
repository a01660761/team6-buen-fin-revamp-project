//import { useState } from "react";
import { Avisos } from "@/components/layout/avisos";

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
    return(
        <form onSubmit={(event)=> {event.preventDefault();
            // Backend
        }}
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
                <input type="text" id="nombre" name="nombre" required autoComplete="given-name" placeholder="Ingresa tu nombre" className="w-full rounded-lg border p-4 border-[var(--card-text-color-3)]"/>
            </div>

            <div className="grid gap-2">
                <label htmlFor="apellidos" className="font-bold">
                    Apellidos*
                </label>
                <input type="text" id="apellidos" name="apellidos" required autoComplete="family-name" placeholder="Ingresa tus apellidos" className="w-full rounded-lg border p-4 border-[var(--card-text-color-3)]"/>
            </div>

            <div className="grid gap-2">
                <label htmlFor="telefono" className="font-bold">
                    Teléfono*
                </label>
                <input type="tel" id="telefono" name="telefono" autoComplete="tel"  placeholder="Ingresa tu número telefónico" className="w-full rounded-lg border p-4 border-[var(--card-text-color-3)]"/>
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
                    Correo Electrónico *
                </label>
                <input type="email" id="email" name="email" placeholder="Ingresa tu correo electronico" className="w-full rounded-lg border p-4 border-[var(--card-text-color-3)]"/>
            </div>

            <div className="grid gap-2">
                <label htmlFor="password" className="font-bold">
                    Contraseña *
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
                Al momento de registrate para el uso de marca de {" "}
                <strong className="font-bold">
                    El Buen Fin
                </strong> {" "},también se procesará tu inscripción al {" "}
                <p className="underline font-bold">
                    Sorteo SAT
                </p> {""} en el marco de El Buen Fin para que las compras realizadas
                en tu negocio participante en el sorteo.
            </p>

            <button type="submit" className="min-h-11 w-full rounded-xl bg-[var(--card-bottom-color)] p-3 font-semibold text-[var(--default-text-color)] focus-visible:outline-2 focus-visible:outline-offset-4">
                Registrarse
            </button>
        </form>
    )
}
