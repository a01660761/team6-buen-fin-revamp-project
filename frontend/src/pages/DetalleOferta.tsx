/**
 * ChatGPT-6.1 Sol was used to review, validate and improve the code.
 * This was amde for this particular page to reutilize the same page format/design 
 * as the rest of the publioc pages.
 */


import { AdminContext, ResourceContextProvider } from "react-admin";
import { OfferShow } from "@/offer";
import { dataProvider } from "@/dataProvider";
import { i18nProvider } from "@/i18nProvider";
import { Topbar } from "@/components/layout/Topbar";
import { Footer } from "@/components/layout/Footer";

export default function DetalleOferta() {
    return (
        <div className="flex min-h-screen flex-col bg-[var(--background-color)]">
            <Topbar />

            <main className="w-full flex-1 px-4 py-8 sm:px-8 sm:py-12 lg:px-12">
                <AdminContext
                    dataProvider={dataProvider}
                    i18nProvider={i18nProvider}
                >
                    <ResourceContextProvider value="catalogOffers">
                        <OfferShow />
                    </ResourceContextProvider>
                </AdminContext>
            </main>

            <Footer />
        </div>
    );
}