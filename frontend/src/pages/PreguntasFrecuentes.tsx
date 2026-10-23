import { Topbar } from "@/components/layout/Topbar";
import { Footer } from "@/components/layout/Footer";
import preguntas_photo from '@/assets/photos_promotion/preguntas.jpg';
import ReactMarkdown from "react-markdown";
import preguntas_frecuentes from "@/utils/preguntas.md?raw";

/*

ChatGPT-6 Luna se utilizo para lo siguiente:
- Colocar un Markdown , el elemento que nos va a permitir leer un archivo .md y lo va a organizar conforme la estructura que diseñemos en el .md
-----------------------------------
- .md?raw : Obtiene el contenido del .md como un string y no como un componente
- menu.split(/^## /m) : divide el texto que encuentra un encabezado que comienza con ##
    ^i : inicio de la línea | m : perminte que ^ detecte el inicio de cada línea
- slice : devuelve un arreglo sin su primer elemento
- .map((bloque)) => { }  : recorre cda bloque y genera un elemento de Reac
- const [titulo, ...contenido] = bloque.split("/n") : Permite separar el título y el contenido
    Primero divide el bloque en lineas , después ocurre la desentrucuración de arreglos =>(titulo y el contenido) 
    ... : significa <<guarda todos los elementos restantes en una rreglos llamado contenido>>
- join("\n") : Une las líneas del contenido, conservando los saltos de línea

Quedado el recorrido de datos
Text Markdown (md)---> Separación de secciones (split() + slice()) ---> Obtiene el titulo y el contenido (map() + desestructuración) ----> detauks + ReactMardown (Muestra los panales despegables)

*/

export default function PreguntasFrecuentes() {
    return (
        <div className="min-h-screen bg-[var(--background-color)] text-[var(--default-text-color-2)]">
            <Topbar />

            <main className="w-full px-4 py-8 sm:px-8 sm:py-12 lg:px-12">
                <section className="grid items-center gap-10 lg:grid-cols-2">
                    <div className="flex flex-col gap-6 rounded-2xl border-l-[12px] border-l-[var(--contrast-color)] bg-[var(--card-middle-background-color)] p-5 sm:p-8">
                        <h1 className="text-3xl font-extrabold sm:text-4xl">
                            Preguntas frecuentes
                        </h1>

                        <p className="text-left text-base leading-relaxed sm:text-justify sm:text-lg lg:text-xl">
                            Encuentra respuestas claras a las preguntas más comunes sobre El Buen Fin: fechas, participantes, promociones, compras seguras y más. Consulta la información que necesitas para aprovechar al máximo esta temporada de ofertas.
                        </p>
                    </div>

                    <img src={preguntas_photo} alt="Preguntas frecuentes de El Buen Fin" className="h-auto w-full rounded-3xl object-contain"/>
                </section>

                {/* Menú de preguntas */}
                <section className="mt-16 w-full sm:mt-16">
                    <h2 className="sr-only">Listado de pregunta frecuentes</h2>
                    {/* Lee el archivo de md */}
                    {preguntas_frecuentes.split(/^## /m).slice(1).map((bloque) => {
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
