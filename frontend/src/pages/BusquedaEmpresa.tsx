
import { BusinessList, BusinessShow } from "@/business";
import { AdminContext, ResourceContextProvider } from "react-admin";
import { dataProvider } from "@/dataProvider";
import { i18nProvider } from "@/i18nProvider";
import { Topbar } from "@/components/layout/Topbar";
import { Footer } from "@/components/layout/Footer";

/* 
Uso de Chatgtp Luna:
Se implemento para usar el código de mi compañero sin tener que modificar su implementación 
Y mientras se implementaba tuve algunos errores del porque no cargaba su pagina y fue debido a
- AdminContext: Preparo el entorno que necesita los componentes de React-Admin
- ResourceContextProvider: Indica en que recurso estamos trabajando
*/

/* Implementación del trabajo de mi compañero Ariel business*/
// Página del buscador
export default function BuscarEmpresas() {
    return (
        <div className="flex min-h-screen flex-col bg-[var(--background-color)]">
            <Topbar />
            <main className="w-full flex-1 px-4 py-8 sm:px-8 sm:py-12 lg:px-12">
                <AdminContext dataProvider={dataProvider} i18nProvider={i18nProvider}>
                    <ResourceContextProvider value="businesses">
                        <BusinessList />
                    </ResourceContextProvider>
                </AdminContext>
            </main>
            <Footer />
        </div>
    );
}

// Página de los detalles del comercio
export function DetalleComercio() {
    return (
        <div className="flex min-h-screen flex-col bg-[var(--background-color)]">
            <Topbar />
            <main className="w-full flex-1 px-4 py-8 sm:px-8 sm:py-12 lg:px-12">
                <AdminContext dataProvider={dataProvider} i18nProvider={i18nProvider}>
                    <ResourceContextProvider value="businesses">
                        <BusinessShow />
                    </ResourceContextProvider>
                </AdminContext>
            </main>

            <Footer />
        </div>
    );
}