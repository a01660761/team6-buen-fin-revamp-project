
import { Topbar } from "@/components/layout/Topbar";
import { Footer } from "@/components/layout/Footer";
import pagotarjeta from '@/assets/photos_promotion/pagotarjeta.jpg';
import ReactMarkdown from "react-markdown";
import menucompras from "@/utils/compras_seguras.md?raw";


export default function CompraSegura() {
    return (
        <div className="min-h-screen bg-[var(--background-color)] text-[var(--default-text-color-2)]">
            <Topbar />

            <main className="w-full px-8 py-12 lg:px-12">
                <section className="grid items-center gap-10 lg:grid-cols-2">
                    <div className="flex flex-col gap-6 rounded-2xl border-l-[12px] border-l-[var(--contrast-color)] bg-[var(--card-middle-background-color)] p-8">
                        <h1 className="text-4xl font-semibold lg:text-5xl">
                            Compras Seguras
                        </h1>
                        <h2 className="text-xl font-semibold">
                            Asoación de Internet.mx
                        </h2>
                        <h3 className="text-lg font-semibold"> TIPS DE CIBERSEGURIDAD</h3>

                        <p className="text-justify text-lg leading-relaxed lg:text-xl">
                            Recomendacions para utilizar el{" "}
                            <a className="font-bold">comercio electrónico</a>{" "}
                            de forma segura. 
                        </p>
                    </div>

                    <img src={pagotarjeta} alt="Compras seguras" className="h-[300px] w-full rounded-3xl object-cover lg:h-[350px]"/>
                </section>

                {/* Menú de preguntas */}
                <section className="mt-16 w-full">
                    {/* Documentar */}
                    {menucompras.split(/^## /m).slice(1).map((bloque) => {
                        const [titulo, ...contenido] = bloque.split("\n");
                        return (
                            <details key={titulo} name="faq" className="group">
                                <summary className="cursor-pointer bg-[var(--card-title-background-color)] px-10 py-6 text-2xl font-extrabold">
                                    {titulo}
                                </summary>

                                <div className="space-y-4 bg-[var(--card-background)] px-10 py-8 text-lg leading-relaxed [&_h3]:font-bold [&_h4]:font-bold [&_p]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:underline">
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
