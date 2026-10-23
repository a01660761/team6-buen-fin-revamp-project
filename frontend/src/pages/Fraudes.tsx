import { Topbar } from "@/components/layout/Topbar";
import { Footer } from "@/components/layout/Footer";
import recomendaciones_photo from '@/assets/photos_promotion/recomendaciones.png';
import ReactMarkdown from "react-markdown";
import fraudes from "@/utils/fraudes.md?raw";


export default function Fraudes() {
    return (
        <div className="min-h-screen bg-[var(--background-color)] text-[var(--default-text-color-2)]">
            <Topbar />

            <main className="w-full px-4 py-8 sm:px-8 sm:py-12 lg:px-12">
                <section className="grid items-center gap-10 lg:grid-cols-2">
                    <div className="flex flex-col gap-6 rounded-2xl border-l-[12px] border-l-[var(--contrast-color)] bg-[var(--card-middle-background-color)] p-5 sm:p-8">
                        <h1 className="text-3xl font-extrabold sm:text-4xl">
                            Tips para prevenir fraudes
                        </h1>

                        <p className="text-left text-base leading-relaxed sm:text-justify sm:text-lg lg:text-xl">
                            Protección al Consumidor
                        </p>
                    </div>

                    <img src={recomendaciones_photo} alt="Recomendaciones para prevenir fraudes durante El Buen Fin" className="h-auto w-full rounded-3xl object-contain"/>
                </section>

                {/* Menú de para prevenir fraudes */}
                <section className="mt-16 w-full">
                    <h2 className="sr-only"> Consejos para prevenir fraudes</h2>
                    {fraudes.split(/^## /m).slice(1).map((bloque) => {
                        const [titulo, ...contenido] = bloque.split("\n");
                        return (
                            <details key={titulo} name="faq" className="group">
                                <summary className="cursor-pointer bg-[var(--card-title-background-color)] px-4 py-4 text-lg font-extrabold focus-visible:outline-2 focus-visible:outline-offset-2 sm:px-10 sm:py-6 sm:text-2xl">
                                    {titulo}
                                </summary>

                                <div className="space-y-4 bg-[var(--card-background)] px-4 py-5 text-base leading-relaxed sm:px-10 sm:py-8 sm:text-lg [&_h3]:font-bold [&_h4]:font-bold [&_p]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6 [&_a]:underline [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-2">
                                    <ReactMarkdown>
                                        {contenido.join("\n")}
                                    </ReactMarkdown>
                                </div>
                            </details>
                        );
                    })}
                </section>
            </main>
            <Footer />
        </div>
    );
}
