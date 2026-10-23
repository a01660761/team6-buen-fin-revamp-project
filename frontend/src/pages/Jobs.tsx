
import { VacancyList, VacancyShow } from "@/vacancy";
import { AdminContext, ResourceContextProvider } from "react-admin";
import { dataProvider } from "@/dataProvider";
import { i18nProvider } from "@/i18nProvider";
import { Topbar } from "@/components/layout/Topbar";
import { Footer } from "@/components/layout/Footer";

/* 
    Código reulizado de la pagina de BusquedaEmpresa
*/

export default function BuscarVacante() {
    return (
        <div className="flex min-h-screen flex-col bg-[var(--background-color)]">
            <Topbar />
            <main className="w-full flex-1 px-4 py-8 sm:px-8 sm:py-12 lg:px-12">
                <AdminContext dataProvider={dataProvider} i18nProvider={i18nProvider}>
                    <ResourceContextProvider value="vacancies">
                        <VacancyList />
                    </ResourceContextProvider>
                </AdminContext>
            </main>
            <Footer />
        </div>
    );
}

// Página de los detalles del comercio
export function DetalleVacante() {
    return (
        <div className="flex min-h-screen flex-col bg-[var(--background-color)]">
            <Topbar />
            <main className="w-full flex-1 px-4 py-8 sm:px-8 sm:py-12 lg:px-12">
                <AdminContext dataProvider={dataProvider} i18nProvider={i18nProvider}>
                    <ResourceContextProvider value="vacancies">
                        <VacancyShow />
                    </ResourceContextProvider>
                </AdminContext>
            </main>

            <Footer />
        </div>
    );
}