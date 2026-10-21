//import { useState } from "react";

type Props = {
    onCancelar?: () => void;
    onGuardar?: (datos: Record <string, string>) => void;
    inicial?: Record<string, string>;

}


export function Nueva_Surcursal( {onCancelar, onGuardar, inicial}: Props){
    // Add the connection with the backend here

    return(
        <form 
            onSubmit={(event) =>{
                event.preventDefault();
                const datos = Object.fromEntries(new FormData(event.currentTarget).entries()) as Record<string,string>;
                onGuardar?.(datos);
            }}
            className="flex flex-col gap-5 rounded-3xl bg-[var(--card-background-2)] p-8 text-[var(--button-text-color)]">
            <h2 className="text-center text-3xl font-bold">
                {inicial ? "Editar sucursal" : "Agregar nueva sucursal"}
            </h2>
            <hr className="border-[var(--card-bottom-color)]"/>
            
            <p className="text-sm font-medium">
                Para registrar una nueva sucursal, ingresa los siguientes datos
                <br/>
                Los campos marcados con un asterisco * son obligatorios.
            </p>

            <div className="grid gap-2">
                <label htmlFor="nombre_sucursal" className="font-bold">
                    Nombre de la sucursal * 
                </label>
                <input type="text" id="nombre_sucursal" name="nombre_sucursal" defaultValue={inicial?.nombre_sucursal} required placeholder="Ingresa el nombre de tu sucursal" className="w-full rounded-lg border p-4 border-[var(--card-text-color-3)]"/>
            </div>

            
            <div className="grid gap-2">
                <label htmlFor="entidad" className="font-bold">
                    Entidad * 
                </label>
                <select id="entidad" name="entidad" defaultValue={inicial?.entidad ?? ""} required className="w-full rounded-lg border p-4 border-[var(--card-text-color-3)]">
                    <option value="" disabled>Selecciona una entidad</option>
                    <option value="administrador">Testing</option>
                    <option value="empleado">Testing</option>
                    <option value="cliente">Testing</option>
                    <option value="otro">Otra entidad</option>
                </select>
            </div>

            <div className="grid gap-2">
                <label htmlFor="telefono" className="font-bold">
                    Teléfono * 
                </label>
                <input type="tel" id="telefono" defaultValue={inicial?.telefono} required name="telefono" placeholder="Ingresa tu número telefónico" className="w-full rounded-lg border p-4 border-[var(--card-text-color-3)]"/>
            </div>


            <div className="grid gap-2">
                <label htmlFor="direccion" className="font-bold">
                    Dirección *
                </label>
                <input type="text" id="direccion" defaultValue={inicial?.direccion} required name="direccion" placeholder="Ingresa la dirección" className="w-full rounded-lg border p-4 border-[var(--card-text-color-3)]"/>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <button type="button" onClick={onCancelar} className="w-full rounded-xl bg-[var(--card-bottom-color)] p-3 font-semibold text-[var(--default-text-color)]">
                    Regresar
                </button>
                <button type="submit" className="w-full rounded-xl bg-[var(--card-bottom-color)] p-3 font-semibold text-[var(--default-text-color)]">
                    Guardar Sucursal
                </button>
            </div>
        </form>
    )
}
