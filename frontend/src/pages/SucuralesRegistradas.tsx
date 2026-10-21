
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Topbar } from "@/components/layout/Topbar";
import { Footer } from "@/components/layout/Footer";
import { Nueva_Surcursal } from "@/components/layout/Sucursal_nueva";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

type Sucursal = {
    id: number;
    datos: Record<string, string>;
};

export default function SucursalesRegistradas() {
    const navigate = useNavigate();
    const location = useLocation();

    const empresa = (location.state as { empresa?: string } | null)?.empresa;

    const [sucursales, setSucursales] = useState<Sucursal[]>([]);
    const [abierto, setAbierto] = useState(false);
    const [editando, setEditando] = useState<Sucursal | null>(null);

    function guardarSucursal(datos: Record<string, string>) {
        if (editando) {
            setSucursales(sucursales.map((sucursal) => sucursal.id === editando.id ? { ...sucursal, datos } : sucursal));
        } else {
            setSucursales([...sucursales, {id: Date.now(), datos}]);
        }
        setAbierto(false);
        setEditando(null);
    }

    return (
        <div className="min-h-screen bg-[var(--background-color)] text-[var(--default-text-color-2)]">
            <Topbar />

            <main className="w-full px-8 py-12 lg:px-12">
                <div className="flex justify-end">
                    <button type="button" onClick={() => { setEditando(null); setAbierto(true);}} className="rounded-lg bg-[var(--searching-background-color)] px-6 py-3 font-semibold text-[var(--button-text-color)]">
                        Agregar nueva sucursal
                    </button>
                </div>

                <section className="mt-8 rounded-xl bg-[var(--section-background-color)] p-8 text-[var(--default-text-color)]">
                    <h1 className="text-3xl font-extrabold">
                        Sucursales
                    </h1>

                    {empresa && (
                        <p className="mt-2 text-lg">
                            Empresa: {empresa}
                        </p>
                    )}

                    <hr className="my-6" />

                    <div className="grid grid-cols-3 gap-4 border-b pb-4 text-xl font-semibold">
                        <p>Nombre</p>
                        <p>Teléfono</p>
                        <p>Acciones</p>
                    </div>

                    {sucursales.length === 0 && (
                        <p className="py-10 text-center text-lg">
                            No hay sucursales registradas.
                        </p>
                    )}

                    {sucursales.map((sucursal) => (
                        <div key={sucursal.id} className="grid grid-cols-3 items-center gap-4 border-b py-5">
                            <p>{sucursal.datos.nombre_sucursal}</p>
                            <p>{sucursal.datos.telefono}</p>

                            <div className="flex flex-wrap gap-3">
                                <button type="button" onClick={() => { setEditando(sucursal); setAbierto(true); }} className="rounded-lg bg-[var(--searching-background-color)] px-4 py-2 font-semibold text-[var(--button-text-color)]">
                                    Editar
                                </button>

                                <button type="button" onClick={() => setSucursales(sucursales.filter((item) => item.id !== sucursal.id))} className="rounded-lg bg-[var(--searching-background-color)] px-4 py-2 font-semibold text-[var(--button-text-color)]">
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className="mt-10 grid gap-6 sm:grid-cols-3">
                        <button type="button" onClick={() => navigate("/empresas")} className="rounded-lg bg-[var(--searching-background-color)] px-5 py-3 font-semibold text-[var(--button-text-color)]">
                            Regresar
                        </button>

                        <button type="button" onClick={() => { setEditando(null); setAbierto(true); }} className="rounded-lg bg-[var(--searching-background-color)] px-5 py-3 font-semibold text-[var(--button-text-color)]">
                            Agregar una sola sucursal
                        </button>

                        <button type="button" disabled title="Pendiente de conectar la importación de Excel" className="rounded-lg bg-[var(--searching-background-color)] px-5 py-3 font-semibold text-[var(--button-text-color)] disabled:opacity-60">
                            Agregar varias sucursales con Excel
                        </button>
                    </div>

                    <hr className="mt-8" />
                </section>
            </main>

            <Footer />

            <Dialog open={abierto} onOpenChange={setAbierto}>
                <DialogContent className="max-h-[90vh] overflow-y-auto p-0 sm:max-w-2xl">
                    <DialogTitle className="sr-only">
                        Registro de sucursal
                    </DialogTitle>

                    <Nueva_Surcursal key={editando?.id ?? "nueva"} inicial={editando?.datos} onCancelar={() => { setAbierto(false); setEditando(null);}} onGuardar={guardarSucursal}/>
                </DialogContent>
            </Dialog>
        </div>
    );
}
