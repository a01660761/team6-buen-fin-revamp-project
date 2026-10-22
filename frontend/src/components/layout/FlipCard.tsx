import { useState,  useRef, type ReactNode } from "react";
import { Card } from "@/components/ui/card"
/*
ChatGPT-6 Luna se utilizo para lo siguiente:
Como herramienta de apoyo para mejorar la accesibilidad y mejorar el código de las tarjetas
*/
type FlipCardProps= { // datos que recibe el componente y el tipo que debe ser 
    title: string;
    description: string;
    icon: ReactNode;
    href: string;
    name: string;
}

export function FlipCard({title,description,icon,href,name}: FlipCardProps) {
    const[fliped, setfliped] = useState(false);
    const frenteRef = useRef<HTMLButtonElement>(null);
    const volverRef = useRef<HTMLButtonElement>(null);

    return(
        <div className="w-full text-[var(--default-text-color-2)] [perspective:1000px]">
            
            {/* Carta de frente */}
            <div className={`relative h-52 transition-transform duration-500 [transform-style:preserve-3d] ${fliped ? "[transform:rotateY(180deg)]" : ""}`}>
                <Card aria-hidden={fliped} className="absolute inset-0 flex flex-col items-center justify-center gap-3 border-2 border-[var(--card-bottom-color)] bg-[var(--card-background)] p-4 text-center [backface-visibility:hidden]">
                    <span aria-hidden="true">{icon}</span>
                    <h3 className="font-bold">{title}</h3> 

                    <button ref={frenteRef} type="button" tabIndex={fliped? -1 : 0 } aria-label={`Ver información sobre ${title}`} onClick={()=> {setfliped(true); volverRef.current?.focus();}} className="absolute inset-0 cursor-pointer rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2"/>    
                </Card> 

                {/* Carta de atras*/}
                <Card aria-hidden={!fliped} className="absolute inset-0 flex items-center justify-center border-2 border-[var(--card-bottom-color)] bg-[var(--card-middle-background-color)] p-4 text-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    <div className="relative flex h-full w-full flex-col items-center justify-center gap-3">
                        <button ref={volverRef} type="button" tabIndex={fliped ? 0: -1} aria-label={`Volver al frente de ${title}`} onClick={() => {setfliped(false); frenteRef.current?.focus()}} className="absolute inset-0 cursor-pointer rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2"/>
                        <p className="pointer-events-none font-semibold text-sm">{description}</p>
                        <a href={href} tabIndex={fliped ? 0 : -1} className="relative z-10 rounded-xl bg-[var(--card-bottom-color)] px-4 py-2 font-semibold text-[var(--default-text-color)] focus-visible:outline-2 focus-visible:outline-offset-2">{name}</a>
                    </div>
                </Card>
            </div>
        </div>
    )
}