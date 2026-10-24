/**
 *
 * NOTE: some of the fields in the corresponding form for adding businesses were ultimately not implemented in the backend; we decided to keep them
 * in case we want to implement them in the future.
 */


import { useState } from 'react';

type Props = {
    onCancelar?: () => void;
    onGuardar?: (datos: Record<string, string>) => void;
    inicial?: Record<string, string>;
    guardando?: boolean;
    error?: string;
};

export function RegistroEmpresa({ onCancelar, onGuardar, inicial, guardando = false, error = "" }: Props) {
    const [tipoComercio, setTipoComercio] = useState(inicial?.tipoComercio ?? "fisica");
    const [categoria, setCategoria] = useState(inicial?.categorias ?? "");

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                if (guardando) return;
                const datos = Object.fromEntries( //convierte esos pares en un objeto de Javascript
                    new FormData(event.currentTarget).entries() // entries : obtiene los datos
                ) as Record<string, string>;
                onGuardar?.(datos);
            }}
            className="flex w-full min-w-0 flex-col gap-5 rounded-3xl bg-[var(--card-background-2)] p-5 text-[var(--button-text-color)] sm:p-8"
        >
            <h2 className="text-center text-3xl font-bold">
                {inicial ? "Editar Empresa" : "Agregar nueva empresa"}
            </h2>

            <hr className="border-[var(--card-bottom-color)]" />

            <p className="font-semibold">* Campos requeridos</p>

            <div className="grid gap-2">
                <label htmlFor="nombreComercial" className="font-bold">
                    Nombre Comercial *
                </label>
                <input type="text" id="nombreComercial" name="nombreComercial" defaultValue={inicial?.nombreComercial} required maxLength={200} className="w-full rounded-lg border border-[var(--card-line-color)] bg-white p-3" />
            </div>

            {/* <div className="grid gap-2">
                <label htmlFor="tipoPersona" className="font-bold">
                    Tipo de contribuyente *
                </label>
                <select id="tipoPersona" name="tipoPersona" defaultValue={inicial?.tipoPersona ?? ""} required className="w-full rounded-lg border border-[var(--card-line-color)] bg-white p-3">
                    <option value="" disabled>Selecciona una opción</option>
                    <option value="fisica">Persona física</option>
                    <option value="moral">Persona moral</option>
                </select>

                <label htmlFor="razonSocial" className="font-bold">
                    Nombre o Razón Social *
                </label>
                <input type="text" id="razonSocial" name="razonSocial" placeholder="Como aparece en tu Constancia de Situación Fiscal" defaultValue={inicial?.razonSocial} required maxLength={200}
                    className="w-full rounded-lg border border-[var(--card-line-color)] bg-white p-3" />
                <details className="text-sm">
                    <summary className="cursor-pointer font-semibold underline underline-offset-4">
                        ¿Qué debo escribir aquí?
                    </summary>
                    <p className="mt-2">
                        Ingresa tu nombre completo si eres persona física, o la denominación o razón social registrada si eres persona moral.
                        <b>Utiliza exactamente los datos de tu Constancia de Situación Fiscal.</b>
                    </p>
                </details>
            </div>*/}

            <div className="grid gap-2">
                <label htmlFor="rfc" className="font-bold">RFC *</label>
                <input type="text" id="rfc" name="rfc" defaultValue={inicial?.rfc} required maxLength={13} className="w-full rounded-lg border border-[var(--card-line-color)] bg-white p-3" />
            </div>

            <div className="grid gap-2">
                <label htmlFor="direccion" className="font-bold">
                    Dirección {tipoComercio === "fisica" ? "*" : "(opcional)"}
                </label>
                <input type="text" id="direccion" name="direccion" defaultValue={inicial?.direccion} required={tipoComercio === "fisica"} maxLength={500} autoComplete="street-address" className="w-full rounded-lg border border-[var(--card-line-color)] bg-white p-3" />
            </div>

            {/*<div className="grid gap-2">
                <label htmlFor="colonia" className="font-bold">
                    Colonia o Localidad {tipoComercio === "fisica" ? "*" : "(opcional)"}
                </label>
                <input type="text" id="colonia" name="colonia" defaultValue={inicial?.colonia} required className="w-full rounded-lg border border-[var(--card-line-color)] bg-white p-3" />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-2">
                    <label htmlFor="entidad" className="font-bold">
                        Entidad *
                    </label>
                    <select id="entidad" name="entidad"
                        defaultValue={inicial?.entidad ?? ""} required autoComplete="address-level1"
                        className="w-full rounded-lg border border-[var(--card-line-color)] bg-white p-3">
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
                    <label htmlFor="codigoPostal" className="font-bold">
                        Código Postal *
                    </label>
                    <input type="text" id="codigoPostal" name="codigoPostal" autoComplete="postal-code" defaultValue={inicial?.codigoPostal} required className="w-full rounded-lg border border-[var(--card-line-color)] bg-white p-3" />
                </div>
            </div>

            <div className="grid gap-2">
                <label htmlFor="municipio" className="font-bold">
                    Municipio *
                </label>
                <input type="text" id="municipio" name="municipio" defaultValue={inicial?.municipio} required  autoComplete="address-level2" className="w-full rounded-lg border border-[var(--card-line-color)] bg-white p-3" />
            </div>*/}

            <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-2">
                    <label htmlFor="telefono" className="font-bold">
                        Teléfono *
                    </label>
                    <input type="tel" id="telefono" name="telefono" defaultValue={inicial?.telefono} maxLength={30} autoComplete="tel" className="w-full rounded-lg border border-[var(--card-line-color)] bg-white p-3" />
                </div>

                <div className="grid gap-2">
                    <label htmlFor="correo" className="font-bold">
                        Correo electrónico *
                    </label>
                    <input type="email" id="correo" name="correo" defaultValue={inicial?.correo} maxLength={250} autoComplete="email" className="w-full rounded-lg border border-[var(--card-line-color)] bg-white p-3" />
                </div>
            </div>

            {/*<div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-2">
                    <label htmlFor="sucursales" className="font-bold">
                        Sucursales *
                    </label>
                    <input type="number" min="0" id="sucursales" name="sucursales" defaultValue={inicial?.sucursales} required className="w-full rounded-lg border border-[var(--card-line-color)] bg-white p-3" />
                </div>

                <div className="grid gap-2">
                    <label htmlFor="organismo" className="font-bold">
                        Organismo Empresarial
                    </label>
                    <select id="organismo" name="organismo"
                        defaultValue={inicial?.organismo ?? ""}
                        className="w-full rounded-lg border border-[var(--card-line-color)] bg-white p-3">
                        <option value="">Selecciona una opción</option>
                        <option value="Ninguno">No pertenezco a ninguno</option>
                        <option value="CANACO">CANACO</option>
                        <option value="CANACINTRA">CANACINTRA</option>
                        <option value="COPARMEX">COPARMEX</option>
                        <option value="Otro">Otro organismo</option>
                    </select>
                </div>
            </div>

            <label className="flex items-center gap-3 text-sm">
                <input type="checkbox" name="notificaciones" value="si" defaultChecked={inicial?.notificaciones === "si"} />
                ¿Quiere que se le notifique a la cámara o asociación a la que pertenece?
            </label>*/}

            {/* <fieldset className="grid gap-2">
                <legend className="font-bold">
                    ¿La empresa cuenta con redes sociales?
                </legend>
                <label className="flex gap-3">
                    <input type="radio" name="redesSociales" value="si" defaultChecked={inicial?.redesSociales === "si"}
                    onChange = {()=> setTieneRedes(true)}/>
                    Sí
                </label>
                <label className="flex gap-3">
                    <input type="radio" name="redesSociales" value="no" defaultChecked={!inicial || inicial.redesSociales === "no"}
                    onChange={()=> setTieneRedes(false)}/>
                    No
                </label>

                {tieneRedes && (
                    <div className='grid gap-2'>
                        <label htmlFor='linkRedes' className='font-bold'>
                            Enlace de la red social *
                        </label>
                        <input type='url' id='linkRedes' name='linkRedes' placeholder='https://www.instagram.com/...' defaultValue={inicial?.linkRedes} required className='w-full rounded-lg border border-[var(--card-line-color)] bg-white p-3'/>
                    </div>
                )}

            </fieldset> */}

            <div className="grid gap-2">
                <label htmlFor="descripcion" className="font-bold">
                    Descripción *
                </label>
                <textarea id="descripcion" name="descripcion" rows={5} defaultValue={inicial?.descripcion} required maxLength={5000} className="w-full rounded-lg border border-[var(--card-line-color)] bg-white p-3" />
            </div>

            <fieldset className="grid gap-2">
                <legend className="font-bold">Tipo de Comercio *</legend>
                <label className="flex gap-3">
                    <input type="radio" name="tipoComercio" value="fisica"checked={tipoComercio === "fisica"} onChange={() => setTipoComercio("fisica")} required />
                    Tienda física
                </label>
                <label className="flex gap-3">
                    <input type="radio" name="tipoComercio" value="virtual" checked={tipoComercio === "virtual"} onChange={() => setTipoComercio("virtual")} />
                    Tienda virtual
                </label>
            </fieldset>

            <div className="grid gap-2">
                <label htmlFor="categorias" className="font-bold">
                    Categorías *
                </label>
                <select id="categorias" name="categorias"
                    value={categoria} onChange={(event)=> setCategoria(event.target.value)} required
                    className="w-full rounded-lg border border-[var(--card-line-color)] bg-white p-3">
                    <option value="" disabled>Selecciona una categoría</option>
                    <option value="Alimentos">Alimentos</option>
                    <option value="Moda">Moda</option>
                    <option value="Electrónica">Electrónica</option>
                    <option value="Hogar">Hogar</option>
                    <option value="Servicios">Servicios</option>
                    <option value="Salud">Salud</option>
                </select>
            </div>

            <div className="grid gap-2">
                <label htmlFor="sitioWeb" className="font-bold">
                    Sitio Web
                </label>
                <input type="url" id="sitioWeb" name="sitioWeb" defaultValue={inicial?.sitioWeb} maxLength={2048} placeholder="https://www.miempresa.com.mx" className="w-full rounded-lg border border-[var(--card-line-color)] bg-white p-3" />
            </div>

            {/*<label className="flex items-center gap-3">
                <input type="checkbox" name="mipyme" value="si" defaultChecked={inicial?.mipyme === "si"} />
                ¿Te consideras MIPYME?
            </label>*/}

            <label className="flex items-center gap-3 text-sm font-semibold">
                <input type="checkbox" name="aceptaTerminos" value="si" defaultChecked={Boolean(inicial)} required />
                Acepto los términos y condiciones y el aviso de privacidad.
            </label>

            {error && <p role="alert">{error}</p>}

            {!inicial && (
                <p>Al guardar, tu empresa se publicará en el directorio.</p>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
                <button type="button" onClick={onCancelar}
                    className="min-h-11 rounded-xl bg-[var(--card-bottom-color)] p-3 font-semibold text-[var(--default-text-color)] focus-visible:outline-2 focus-visible:outline-offset-2" disabled={guardando}>
                    Regresar
                </button>

                <button type="submit"
                    className="min-h-11 rounded-xl bg-[var(--card-bottom-color)] p-3 font-semibold text-[var(--default-text-color)] focus-visible:outline-2 focus-visible:outline-offset-2" disabled={guardando}>
                    {guardando ? "Guardando…" : "Guardar Empresa"}
                </button>
            </div>
        </form>
    );
}
