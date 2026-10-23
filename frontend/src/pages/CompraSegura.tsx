
import { Topbar } from "@/components/layout/Topbar";
import { Footer } from "@/components/layout/Footer";
import pagotarjeta from '@/assets/photos_promotion/pagotarjeta.jpg';
import ReactMarkdown from "react-markdown";
import menucompras from "@/utils/compras_seguras.md?raw"; 

/*

ChatGPT-6 Luna se utilizo para lo siguiente:
- Colocar un Markdown , el elemento que nos va a permitir leer un archivo .md y lo va a organizar conforme la estructura que diseñemos en el .md
-----------------------------------
- .md?raw : Obtiene el contenido del .md como un string y no como un componente
- menu.split(/^## /m) : divide el texto que encuentra un encabezado que comienza con ##
    ^i : inicio de la línea | m : perminte que ^ detecte el inicio de cada línea
- slice :  es el elemento arreglado
- .map((bloque)) => { }  : recorre cda bloque y genera un elemento de Reac
- const [titulo, ...contenido] = bloque.split("/n") : Permite separar el título y el contenido
    Primero divide el bloque en lineas , después ocurre la desentrucuración de arreglos =>(titulo y el contenido) 
    ... : significa <<guarda todos los elementos restantes en una rreglos llamado contenido>>
- join("\n") : Une las líneas del contenido, conservando los saltos de línea

Quedado el recorrido de datos
Text Markdown (md)---> Separación de secciones (split() + slice()) ---> Obtiene el titulo y el contenido (mapp() + desestructuración) ----> detauks + ReactMardown (Muestra los panales despegables)

*/

export default function CompraSegura() {
    return (
        <div className="min-h-screen bg-[var(--background-color)] text-[var(--default-text-color-2)]">
            <Topbar />

            <main className="w-full px-4 py-8 sm:px-8 sm:py-12 lg:px-12">
                <section className="grid items-center gap-10 lg:grid-cols-2">
                    <div className="flex flex-col gap-6 rounded-2xl border-l-[12px] border-l-[var(--contrast-color)] bg-[var(--card-middle-background-color)] p-8">
                        <h1 className="text-4xl font-semibold lg:text-5xl">
                            Compras Seguras
                        </h1>
                        <h2 className="text-xl font-semibold">
                            Asoación de Internet.mx
                        </h2>
                        <h3 className="text-lg font-semibold"> TIPS DE CIBERSEGURIDAD</h3>

                        <p className="text-left text-base leading-relaxed sm:text-justify sm:text-lg lg:text-xl">
                            Recomendaciones para utilizar el{" "}
                            <strong className="font-bold">comercio electrónico</strong>{" "}
                            de forma segura. 
                        </p>
                    </div>

                    <img src={pagotarjeta} alt="Compras seguras" className="h-auto w-full rounded-3xl object-contain"/>
                </section>

                {/* Menú de preguntas */}
                <section className="mt-16 w-full">

                    <h2 className="sr-only">Consejos para compras seguras</h2>
                    {menucompras.split(/^## /m).slice(1).map((bloque) => {
                        const [titulo, ...contenido] = bloque.split("\n");
                        return (
                            <details key={titulo} name="faq" className="group">
                                <summary className="cursor-pointer bg-[var(--card-title-background-color)] px-4 py-4 text-lg font-extrabold focus-visible:outline-2 focus-visible:outline-offset-2 sm:px-10 sm:py-6 sm:text-2xl">
                                    {titulo}
                                </summary>

                                <div className="space-y-4 bg-[var(--card-background)] px-4 py-5 text-base leading-relaxed sm:px-10 sm:py-8 sm:text-lg [&_h3]:font-bold [&_h4]:font-bold [&_p]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6 [&_a]:underline">
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
