
import { useState } from "react";
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

type Empresa = {
    id: number;
    datos: Record<string, string>;
    activa: boolean;
    logotipo?: string;
};

export default function EmpresasRegistradas() {
    const navigate = useNavigate();

    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [abierto, setAbierto] = useState(false);
    const [editando, setEditando] = useState<Empresa | null>(null);

    function guardarEmpresa(datos: Record<string, string>) {
        if (editando) {
            setEmpresas(empresas.map((empresa) => empresa.id === editando.id ? { ...empresa, datos } : empresa));
        } else {
            setEmpresas([...empresas, {
                id: Date.now(),
                datos,
                activa: true
            }]);
        }

        setAbierto(false);
        setEditando(null);
    }

    function subirLogotipo(id: number, archivo?: File) {
        if (!archivo) return;

        if (!["image/png", "image/jpeg"].includes(archivo.type) ||
            archivo.size > 500 * 1024) {
            alert("El logotipo debe ser PNG o JPG, máximo 500 KB.");
            return;
        }

        const lector = new FileReader();
        lector.onload = () => {
            setEmpresas((actuales) => actuales.map((empresa) => empresa.id === id ? { ...empresa, logotipo: String(lector.result) } : empresa));
        };
        lector.readAsDataURL(archivo);
    }

    return (
        <div className="min-h-screen bg-[var(--background-color)] text-[var(--default-text-color-2)]">
            <Topbar />

            <main className="w-full px-4 py-8 sm:px-8 sm:py-12 lg:px-12">
                <div className="flex justify-end">
                    <button type="button" onClick={() => { setEditando(null); setAbierto(true);}}
                        className="min-h-11 rounded-lg bg-[var(--searching-background-color)] px-6 py-3 font-semibold text-[var(--button-text-color)] focus-visible:outline-2 focus-visible:outline-offset-2">
                        Agregar nueva empresa
                    </button>
                </div>

                <section className="mt-8 rounded-xl bg-[var(--section-background-color)] p-4 text-[var(--default-text-color)] sm:p-8">
                    <h1 className="text-3xl font-extrabold">
                        Empresas Registradas
                    </h1>

                    <hr className="my-6" />

                    {empresas.length === 0 && (
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

                                    <label className="cursor-pointer rounded-lg bg-[var(--searching-background-color)] px-6 py-3 font-semibold text-[var(--button-text-color)] focus-within:outline-2 focus-within:outline-offset-2">
                                        Subir logotipo
                                        <span className="sr-only">de {empresa.datos.nombreComercial}</span>
                                        <input type="file"  accept=".png,.jpg,.jpeg" className="sr-only" onChange={(event) => subirLogotipo(empresa.id, event.target.files?.[0])} />
                                    </label>

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
                                        <strong className="font-bold">Aviso:</strong>{" "}
                                        El RFC que registrará será verificado.
                                        En caso de que no sea válido, su código QR
                                        devolverá un resultado NO EXITOSO.
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
                                <button type="button" aria-label={`Editar empresa ${empresa.datos.nombreComercial}`} onClick={() => {setEditando(empresa); setAbierto(true);}} className="min-h-11 rounded-lg bg-[var(--searching-background-color)] px-5 py-3 font-semibold text-[var(--button-text-color)] focus-visible:outline-2 focus-visible:outline-offset-2">
                                    Editar Empresa
                                </button>

                                <button type="button" aria-label={`Ver sucursales de ${empresa.datos.nombreComercial}`} onClick={() => navigate("/sucursales", { state: { empresa: empresa.datos.nombreComercial }})}
                                    className="min-h-11 rounded-lg bg-[var(--searching-background-color)] px-5 py-3 font-semibold text-[var(--button-text-color)] focus-visible:outline-2 focus-visible:outline-offset-2">
                                    Sucursales
                                </button>

                                <button type="button" aria-label={`${empresa.activa ? "Inactivar" : "Reactivar"} empresa ${empresa.datos.nombreComercial}`} onClick={() => setEmpresas(empresas.map((item) => item.id === empresa.id ? { ...item, activa: !item.activa }: item))}
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

            <Dialog open={abierto} onOpenChange={setAbierto}>
                <DialogContent className="max-h-[90dvh] w-[calc(100vw-2rem)] overflow-y-auto p-0 sm:max-w-2xl">
                    <DialogTitle className="sr-only">
                        {editando ? "Editar empresa" : "Registrar nueva empresa"}
                    </DialogTitle>

                    <RegistroEmpresa key={editando?.id ?? "nueva"} inicial={editando?.datos} onCancelar={() => { setAbierto(false); setEditando(null); }} onGuardar={guardarEmpresa}/>
                </DialogContent>
            </Dialog>
        </div>
    );
}