
import { useState, type FormEvent } from "react";

type Props = {
    inicial?: Record<string, string>;
    onGuardar?: (datos: Record<string, string>) => void;
    onActualizarContrasena?: (datos: { actual: string; nueva: string;}) => void;
};

export function DatosCuenta({ inicial, onGuardar, onActualizarContrasena}: Props) {
    const [error, setError] = useState("");

    const campo ="min-h-11 w-full rounded-lg border border-[var(--card-bottom-color)] bg-transparent px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2";

    function cambiarContrasena(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const datos = new FormData(event.currentTarget);

        const actual = String(datos.get("contrasenaActual") ?? "");
        const nueva = String(datos.get("contrasenaNueva") ?? "");
        const confirmar = String(datos.get("confirmarContrasena") ?? "");

        if (nueva !== confirmar) {
            setError("Las contraseñas nuevas no coinciden.");
            return;
        }

        setError("");
        onActualizarContrasena?.({ actual, nueva });
    }

    return (
        <section className="mx-auto w-full max-w-3xl overflow-hidden rounded-3xl bg-[var(--card-background)] text-[var(--default-text-color-2)]">

            {/* Título */}
            <header className="bg-[var(--section-background-color)] px-5 py-6 text-center text-[var(--default-text-color)]">
                <h1 className="text-2xl font-extrabold sm:text-3xl">
                    Datos de la cuenta
                </h1>
            </header>

            <div className="space-y-8 p-5 sm:p-8">

                {/* Formulario de datos personales */}
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        const datos = Object.fromEntries(
                            new FormData(event.currentTarget).entries()
                        ) as Record<string, string>;

                        onGuardar?.(datos);
                    }}
                    className="flex flex-col gap-5"
                >
                    <p className="text-lg font-bold">
                        * Campo requerido
                    </p>

                    <div className="grid gap-2">
                        <label htmlFor="nombre" className="font-bold">
                            Nombre
                        </label>
                        <input type="text" id="nombre" name="nombre" defaultValue={inicial?.nombre} autoComplete="given-name" className={campo}/>
                    </div>

                    <div className="grid gap-2">
                        <label htmlFor="apellido" className="font-bold">
                            Apellido
                        </label>
                        <input type="text" id="apellido" name="apellido" defaultValue={inicial?.apellido} autoComplete="family-name" className={campo}/>
                    </div>

                    <div className="grid gap-2">
                        <label htmlFor="telefono" className="font-bold">
                            Teléfono *
                        </label>
                        <input type="tel" id="telefono" name="telefono" defaultValue={inicial?.telefono} autoComplete="tel" required className={campo}/>
                    </div>

                    <div className="grid gap-2">
                        <label htmlFor="puesto" className="font-bold">
                            Puesto
                        </label>
                        <input type="text" id="puesto"  name="puesto" defaultValue={inicial?.puesto} autoComplete="organization-title" className={campo}/>
                    </div>

                    <div className="flex justify-end">
                        <button type="submit" className="min-h-11 rounded-lg bg-[var(--card-bottom-color)] px-6 py-3 font-semibold text-[var(--default-text-color)] focus-visible:outline-2 focus-visible:outline-offset-2">
                            Guardar Cambios
                        </button>
                    </div>
                </form>

                <hr className="border-[var(--card-bottom-color)]" />

                {/* Formulario de contraseña */}
                <form onSubmit={cambiarContrasena} className="flex flex-col gap-5">
                    <h2 className="text-xl font-bold">
                        Cambio de contraseña
                    </h2>

                    <div className="grid gap-2">
                        <label htmlFor="contrasenaActual" className="font-bold">
                            Contraseña actual *
                        </label>
                        <input type="password" id="contrasenaActual" name="contrasenaActual" autoComplete="current-password" required className={campo}/>
                    </div>

                    <div className="grid gap-2">
                        <label htmlFor="contrasenaNueva" className="font-bold">
                            Nueva contraseña *
                        </label>
                        <input type="password" id="contrasenaNueva" name="contrasenaNueva" autoComplete="new-password" required className={campo}/>
                    </div>

                    <div className="grid gap-2">
                        <label htmlFor="confirmarContrasena" className="font-bold">
                            Confirma la contraseña *
                        </label>
                        <input type="password" id="confirmarContrasena" name="confirmarContrasena" autoComplete="new-password" aria-invalid={Boolean(error)} aria-describedby={ error ? "error-contrasena" : undefined } required className={campo}
                        />
                    </div>

                    {error && (
                        <p id="error-contrasena" role="alert" className="font-semibold text-[var(--contrast-color)]">
                            {error}
                        </p>
                    )}

                    <div className="flex justify-end">
                        <button type="submit" className="min-h-11 rounded-lg bg-[var(--card-bottom-color)] px-6 py-3 font-semibold text-[var(--default-text-color)] focus-visible:outline-2 focus-visible:outline-offset-2">
                            Actualizar Contraseña
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}
