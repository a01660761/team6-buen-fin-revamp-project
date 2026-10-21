
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

import ReactMarkdown from "react-markdown";
import aviso from "@/utils/avisos_privacidad.md?raw";
import terminos from "@/utils/terminos_condiciones.md?raw";

/*
ChatGPT-6 Luna se utilizo para lo siguiente:
- Tailwind CSS
- Se utilizo para renderizar los componetes
- Se utilizo para mejorar el código
- Se utlizo para corregir los errores de sintaxis (typos)
- Y se utilizo para mejorar la accesibilidad (tamaño)
-----------
- type Props : Los valores que acepta, este componente se reutliza para Avisos de privacidad y para Términos y Condiciones
- [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-bold [&_h3]:font-bold [&_h4]:font-semibold [&_p]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6 [&_a]:break-words [&_a]:underline">
Se utilizao para poder ponerle un estilo más personalizado, para ser más especificos personalizamos los estilos generados por ReactMarkdown
*/

type Props = {
    tipo: "privacidad" | "terminos";
};

export function Avisos({ tipo }: Props) {
    const [abierto, setAbierto] = useState(false);
    const privacidad = tipo === "privacidad";

    return (
        <>
            <button
                type="button" onClick={() => setAbierto(true)} className="cursor-pointer text-left hover:underline focus-visible:outline-2 focus-visible:outline-offset-4">
                {privacidad ? "Aviso de privacidad" : "Términos y condiciones"}
            </button>

            <Dialog open={abierto} onOpenChange={setAbierto}>
                <DialogContent className="flex max-h-[90dvh] w-[calc(100vw-2rem)] overflow-hidden rounded-2xl bg-white p-4 text-[var(--default-text-color-2)] sm:max-w-2xl sm:p-8">

                    <DialogTitle className="text-center text-xl font-extrabold text-[var(--topbar-background-color)] sm:text-2xl">
                        {privacidad
                            ? "AVISO DE PRIVACIDAD INTEGRAL"
                            : "TÉRMINOS Y CONDICIONES"}
                    </DialogTitle>

                    <div tabIndex={0} role="region" aria-label={privacidad? "Contenido del aviso de privacidad" : "Contenido de términos y condiciones"}
                        className="min-h-0 flex-1 overflow-y-auto border-y py-5 text-sm leading-relaxed focus-visible:outline-2 sm:text-base [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-bold [&_h3]:font-bold [&_h4]:font-semibold [&_p]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6 [&_a]:break-words [&_a]:underline">

                        <ReactMarkdown>
                            {privacidad ? aviso : terminos}
                        </ReactMarkdown>
                    </div>

                    <div className="flex justify-end">
                        <button type="button" onClick={() => setAbierto(false)} className="min-h-11 rounded-lg bg-[var(--topbar-background-color)] px-8 py-3 font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--contrast-color)]">
                            Aceptar
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
