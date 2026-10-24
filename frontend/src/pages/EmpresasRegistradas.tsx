// import { useState } from "react";
import { useEffect, useState } from "react";
import {
    API_URL,
    getCurrentUser,
    httpClient,
    TOKEN_KEY,
} from "@/apiClient";
import { useNavigate } from "react-router-dom";
import { Topbar } from "@/components/layout/Topbar";
import { Footer } from "@/components/layout/Footer";
import { RegistroEmpresa } from "@/components/layout/Registro_empresa";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

/*
ChatGPT-6 Luna se utilizo para lo siguiente:
- Tailwind CSS (overflow)
- Se utlizo para corregir los errores de sintaxis (typos)
---------------------
- subirLogotipo(empresa.id, event.target.files?.[0])
    empresas id: identificador en donde la empresa pertenece
    event.tarjet.files?.[0] obtiene el primer archivo seleccionado por el usuario
    ... : Sirven para copiar/expandir los elementos de arreglod y propiedades de objetos
    ...empresas: copia los elementos del arreglo actual
- readAsDataURL(archivo) : Empieza a leer la imagen seleccionada
- lector.onload :  Se ejecuta cuando termina la lectura
- setEmpresas() : actualiza el logotipo y react vuelve a mostrarlo
*/

type EmpresaRespuesta = {
    id: string;
    name: string;
    rfc: string;
    category: string;
    physicalStore: boolean;
    isActive: boolean;
    description?: string;
    address?: string;
    contactEmail?: string;
    contactPhone?: string;
    websiteUrl?: string;
}; // we now have a type for the response from the API, which includes all the properties of the company object

type Empresa = {
    id: string;
    datos: Record<string, string>; // the object that contains the properties of the company, such as name, RFC, category, etc.
    activa: boolean;
    logotipo?: string;
};

function adaptarEmpresa(empresa: EmpresaRespuesta): Empresa {
    return {
        id: empresa.id,
        activa: empresa.isActive,
        datos: {
            nombreComercial: empresa.name,
            rfc: empresa.rfc,
            categorias: empresa.category,
            tipoComercio: empresa.physicalStore ? "fisica" : "virtual",
            descripcion: empresa.description ?? "",
            direccion: empresa.address ?? "",
            correo: empresa.contactEmail ?? "",
            telefono: empresa.contactPhone ?? "",
            sitioWeb: empresa.websiteUrl ?? "",
        },
    }; // we return all this data in the format that our component expects
}

export default function EmpresasRegistradas() {
    const navigate = useNavigate();

    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [abierto, setAbierto] = useState(false);
    const [editando, setEditando] = useState<Empresa | null>(null);
    const [cargando, setCargando] = useState(true);
    const [autorizado, setAutorizado] = useState(false);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState("");
    const [pagina, setPagina] = useState(0);
    const [total, setTotal] = useState(0);
    const [revision, setRevision] = useState(0);

    function informarError(errorRecibido: unknown) {
        const estado = (errorRecibido as { status?: number }).status;

        if (estado === 401) {
            sessionStorage.removeItem(TOKEN_KEY);
            window.location.assign("/");
            return;
        }

        setError(
            estado === 409 ? "Ya existe una empresa con ese RFC." : estado === 400
            ? "Revisa el RFC, la categoría, la dirección y los datos de contacto." : "No pudimos completar la operación. Intenta nuevamente."
        );
    }

    useEffect(() => {
        let activo = true;

        async function cargarEmpresas() {
            setCargando(true);
            setError("");
            setEmpresas([]);

            try {
                const usuario = await getCurrentUser();

                if (!activo) return;

                if (usuario.role !== "business") {
                    window.location.assign("/admin");
                    return;
                } // if the user is not a business user, redirect to the admin page

                setAutorizado(true);

                const parametros = new URLSearchParams({
                    _sort: "name",
                    _order: "ASC",
                    _start: String(pagina * 10),
                    _end: String((pagina + 1) * 10),
                });

                const { json, headers } = await httpClient(
                    `${API_URL}/companies?${parametros}`
                ); // we make a request to the API to get the companies, with the parameters for sorting and pagination

                if (activo) {
                    setEmpresas(
                        (json as EmpresaRespuesta[]).map(adaptarEmpresa)
                    );

                    setTotal(
                        Number(headers.get("X-Total-Count") ?? 0)
                    );
                }
            }

            catch (errorRecibido) {
                if (!activo) return;

                const estado = (
                    errorRecibido as { status?: number }
                ).status;

                if (estado === 401) {
                    sessionStorage.removeItem(TOKEN_KEY);
                    window.location.assign("/");
                }

                else {
                    setError(
                        "No pudimos cargar tus empresas. Recarga la página para intentar nuevamente."
                    );
                }
            }

            finally {
                if (activo) setCargando(false);
            }
        }

        void cargarEmpresas();

        return () => {
            activo = false;
        };
    }, [pagina, revision]);

    async function guardarEmpresa(datos: Record<string, string>) {
        if (guardando || !autorizado) return; // if we are already saving or the user is not authorized, we do nothing

        setGuardando(true);
        setError("");

        try {
            const camposOpcionales = {
                description: datos.descripcion,
                address: datos.direccion,
                contactEmail: datos.correo,
                contactPhone: datos.telefono,
                websiteUrl: datos.sitioWeb,
            };

            const opcionales = Object.fromEntries(
                Object.entries(camposOpcionales)
                    .map(([campo, valor]) => [
                        campo,
                        valor?.trim() || (editando ? null : undefined),
                    ]) // if the value is empty, we set it to null if we are editing, or undefined if we are creating
                    .filter(([, valor]) => valor !== undefined) // we remove the fields that are undefined
            );

            const payload = {
                name: datos.nombreComercial.trim(),
                rfc: datos.rfc.trim().toUpperCase(),
                category: datos.categorias,
                physicalStore: datos.tipoComercio === "fisica",
                ...opcionales,
                ...(!editando ? { isActive: true } : {}),
            };

            await httpClient(
                editando
                    ? `${API_URL}/companies/${encodeURIComponent(editando.id)}`
                    : `${API_URL}/companies`,
                {
                    method: editando ? "PUT" : "POST",
                    body: JSON.stringify(payload),
                } // we send a PUT request if we are editing, or a POST request if we are creating a new company
            );

            setAbierto(false);
            setEditando(null);

            if (!editando) setPagina(0); // if we are creating a new company, we go back to the first page to see it

            setRevision((actual) => actual + 1); // we increment the revision to trigger a reload of the companies list
        }

        catch (errorRecibido) {
            informarError(errorRecibido);
        }

        finally {
            setGuardando(false);
        }
    }

    async function cambiarEstado(empresa: Empresa) {
        if (guardando || !autorizado) return;

        setGuardando(true);
        setError("");

        try {
            await httpClient(
                `${API_URL}/companies/${encodeURIComponent(empresa.id)}`,
                {
                    method: "PUT",
                    body: JSON.stringify({
                        isActive: !empresa.activa,
                    }),
                } // we send a PUT request to change the active state of the company
            );

            setRevision((actual) => actual + 1);
        }

        catch (errorRecibido) {
            informarError(errorRecibido);
        }

        finally {
            setGuardando(false);
        }
    }


    return (
        <div className="min-h-screen bg-[var(--background-color)] text-[var(--default-text-color-2)]">
            <Topbar />

            <main className="w-full px-4 py-8 sm:px-8 sm:py-12 lg:px-12">
                <div className="flex justify-end">
                    <button type="button" onClick={() => { setError(""); setEditando(null); setAbierto(true); }}
                    disabled={!autorizado || cargando || guardando} className="min-h-11 rounded-lg bg-[var(--searching-background-color)] px-6 py-3 font-semibold text-[var(--button-text-color)] focus-visible:outline-2 focus-visible:outline-offset-2">
                        Agregar nueva empresa
                    </button>
                </div>

                <div className="mt-6 flex items-center justify-between gap-4">
                    <button
                        type="button"
                        disabled={pagina === 0 || cargando || guardando}
                        onClick={() => setPagina((actual) => actual - 1)}
                    > {/* if we are on the first page, or if we are loading or saving, we disable the button */}
                        Anterior
                    </button>

                    <span>
                        Página {pagina + 1} · {total} empresas {/* we show the current page and the total number of companies */}
                    </span>

                    <button
                        type="button"
                        disabled={
                            (pagina + 1) * 10 >= total || cargando || guardando
                        }
                        onClick={() => setPagina((actual) => actual + 1)}
                    >{/* if we are on the last page, or if we are loading or saving, we disable the button */}
                        Siguiente
                    </button>
                </div>

                <section className="mt-8 rounded-xl bg-[var(--section-background-color)] p-4 text-[var(--default-text-color)] sm:p-8">
                    <h1 className="text-3xl font-extrabold">
                        Empresas Registradas
                    </h1>

                    <hr className="my-6" />

                    {error && <p role="alert">{error}</p>}

                    {cargando && (
                        <p role="status">Cargando empresas…</p>
                    )}

                    {!cargando && !error && empresas.length === 0 && (
                        <p className="py-10 text-center">
                            No hay empresas registradas.
                        </p>
                    )}

                    {empresas.map((empresa) => (
                        <div key={empresa.id} className="py-6">
                            <div className="grid items-start gap-10 lg:grid-cols-3">

                                {/* Logotipo */}
                                <div className="flex flex-col items-center gap-4">
                                    <div className="flex h-44 w-full items-center justify-center overflow-hidden rounded-lg bg-[var(--searching-background-color)]">
                                        {empresa.logotipo ? (
                                            <img src={empresa.logotipo} alt={`Logotipo de ${empresa.datos.nombreComercial}`} className="h-full w-full object-contain" />) : (
                                            <p className="text-[var(--button-text-color)]">
                                                Logotipo
                                            </p>
                                        )}
                                    </div>

                                    <p className="text-sm">
                                        La carga de logotipos no está disponible actualmente.
                                    </p>

                                    <p className="text-sm">
                                        Archivo PNG o JPG máximo 500 KB
                                    </p>
                                </div>

                                {/* Información */}
                                <div className="flex flex-col gap-5">
                                    <div className="rounded-lg bg-[var(--card-middle-background-color)] p-5 text-[var(--button-text-color)]">
                                        <h2 className="text-xl font-bold">
                                            {empresa.datos.nombreComercial}
                                        </h2>
                                        <p>RFC: {empresa.datos.rfc}</p>
                                        <p>{empresa.datos.descripcion}</p>
                                    </div>

                                   <p className="text-sm leading-relaxed">
                                        <strong>Aviso:</strong>{" "}
                                        Se valida el formato del RFC. Este registro no realiza
                                        una verificación ante el SAT.
                                    </p>
                                </div>

                                {/* Documentos */}
                                <div className="flex flex-col gap-5">
                                    <button type="button" disabled
                                        className="min-h-11 rounded-lg bg-[var(--searching-background-color)] px-5 py-3 font-semibold text-[var(--button-text-color)] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2">
                                        Guía de integración del QR
                                    </button>

                                    <button type="button" disabled
                                        className="min-h-11 rounded-lg bg-[var(--searching-background-color)] px-5 py-3 font-semibold text-[var(--button-text-color)] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2">
                                        Manual de identidad del Buen Fin
                                    </button>

                                    <button type="button" disabled
                                        className="min-h-11 rounded-lg bg-[var(--searching-background-color)] px-5 py-3 font-semibold text-[var(--button-text-color)] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2">
                                        Descargar código QR
                                    </button>
                                </div>
                            </div>

                            {/* Acciones */}
                            <div className="mt-10 grid gap-6 lg:grid-cols-3">
                                <button type="button" aria-label={`Editar empresa ${empresa.datos.nombreComercial}`} onClick={() => { setError(""); setEditando(empresa); setAbierto(true); }} disabled={cargando || guardando} className="min-h-11 rounded-lg bg-[var(--searching-background-color)] px-5 py-3 font-semibold text-[var(--button-text-color)] focus-visible:outline-2 focus-visible:outline-offset-2">
                                    Editar Empresa
                                </button>

                                <button type="button" aria-label={`Ver sucursales de ${empresa.datos.nombreComercial}`} onClick={() => navigate("/sucursales", { state: { empresa: empresa.datos.nombreComercial }})}
                                    className="min-h-11 rounded-lg bg-[var(--searching-background-color)] px-5 py-3 font-semibold text-[var(--button-text-color)] focus-visible:outline-2 focus-visible:outline-offset-2">
                                    Sucursales
                                </button>

                                <button type="button" aria-label={`${empresa.activa ? "Inactivar" : "Reactivar"} empresa ${empresa.datos.nombreComercial}`} onClick={() => cambiarEstado(empresa)} disabled={cargando || guardando}
                                    className="min-h-11 rounded-lg bg-[var(--searching-background-color)] px-5 py-3 font-semibold text-[var(--button-text-color)] focus-visible:outline-2 focus-visible:outline-offset-2">
                                    {empresa.activa ? "Inactivar Empresa" : "Reactivar Empresa"}
                                </button>
                            </div>

                            <hr className="mt-8" />
                        </div>
                    ))}
                </section>
            </main>

            <Footer />

            <Dialog open={abierto}onOpenChange={(valor) => {
                if (!guardando) setAbierto(valor);
            }}>
                <DialogContent className="max-h-[90dvh] w-[calc(100vw-2rem)] overflow-y-auto p-0 sm:max-w-2xl">
                    <DialogTitle className="sr-only">
                        {editando ? "Editar empresa" : "Registrar nueva empresa"}
                    </DialogTitle>

                    <RegistroEmpresa key={editando?.id ?? "nueva"} inicial={editando?.datos} onCancelar={() => { setAbierto(false); setEditando(null); }} onGuardar={guardarEmpresa} guardando={guardando} error={error} />
                </DialogContent>
            </Dialog>
        </div>
    );
}