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
            className="flex w-full min-w-0 flex-col gap-5 rounded-3xl bg-[var(--card-background-2)] p-5 text-[var(--button-text-color)] sm:p-8">
            <h2 className="text-center text-2xl font-bold sm:text-3xl">
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
                <select id="entidad" name="entidad" defaultValue={inicial?.entidad ?? ""} required autoComplete="address-level1" className="w-full rounded-lg border p-4 border-[var(--card-text-color-3)]">
                    <option value="" disabled>Selecciona una entidad</option>
                    <option value="Aguascalientes">Aguascalientes</option>
                        <option value="Baja California">Baja California</option>
                        <option value="Baja California Sur">Baja California Sur</option>
                        <option value="Campeche">Campeche</option>
                        <option value="Chiapas">Chiapas</option>
                        <option value="Chihuahua">Chihuahua</option>
                        <option value="Ciudad de México">Ciudad de México</option>
                        <option value="Coahuila">Coahuila</option>
                        <option value="Colima">Colima</option>
                        <option value="Durango">Durango</option>
                        <option value="Estado de México">Estado de México</option>
                        <option value="Guanajuato">Guanajuato</option>
                        <option value="Guerrero">Guerrero</option>
                        <option value="Hidalgo">Hidalgo</option>
                        <option value="Jalisco">Jalisco</option>
                        <option value="Michoacán">Michoacán</option>
                        <option value="Morelos">Morelos</option>
                        <option value="Nayarit">Nayarit</option>
                        <option value="Nuevo León">Nuevo León</option>
                        <option value="Oaxaca">Oaxaca</option>
                        <option value="Puebla">Puebla</option>
                        <option value="Querétaro">Querétaro</option>
                        <option value="Quintana Roo">Quintana Roo</option>
                        <option value="San Luis Potosí">San Luis Potosí</option>
                        <option value="Sinaloa">Sinaloa</option>
                        <option value="Sonora">Sonora</option>
                        <option value="Tabasco">Tabasco</option>
                        <option value="Tamaulipas">Tamaulipas</option>
                        <option value="Tlaxcala">Tlaxcala</option>
                        <option value="Veracruz">Veracruz</option>
                        <option value="Yucatán">Yucatán</option>
                        <option value="Zacatecas">Zacatecas</option>
                </select>
            </div>

            <div className="grid gap-2">
                <label htmlFor="telefono" className="font-bold">
                    Teléfono * 
                </label>
                <input type="tel" id="telefono" defaultValue={inicial?.telefono} required autoComplete="tel" name="telefono" placeholder="Ingresa tu número telefónico" className="w-full rounded-lg border p-4 border-[var(--card-text-color-3)]"/>
            </div>


            <div className="grid gap-2">
                <label htmlFor="direccion" className="font-bold">
                    Dirección *
                </label>
                <input type="text" id="direccion" defaultValue={inicial?.direccion} required autoComplete="street-address" name="direccion" placeholder="Ingresa la dirección" className="w-full rounded-lg border p-4 border-[var(--card-text-color-3)]"/>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <button type="button" onClick={onCancelar} className="min-h-11 w-full rounded-xl bg-[var(--card-bottom-color)] p-3 font-semibold text-[var(--default-text-color)] focus-visible:outline-2 focus-visible:outline-offset-2">
                    Regresar
                </button>
                <button type="submit" className="min-h-11 w-full rounded-xl bg-[var(--card-bottom-color)] p-3 font-semibold text-[var(--default-text-color)] focus-visible:outline-2 focus-visible:outline-offset-2">
                    Guardar Sucursal
                </button>
            </div>
        </form>
    )
}
