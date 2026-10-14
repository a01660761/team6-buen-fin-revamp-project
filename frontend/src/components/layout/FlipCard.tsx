import { useState, type ReactNode } from "react";
import { Card } from "@/components/ui/card"

type FlipCardProps= {
    title: string;
    description: string;
    icon: ReactNode;
    href: string;
    name: string;
}

export function FlipCard({title,description,icon,href,name}: FlipCardProps) {
    const[fliped, setfliped] = useState(false);
    return(
        <div className="w-full text-[var(--default-text-color-2)] [perspective:1000px]">
            
            {/* Comentar más adelante */}
            <div className={`relative h-52 transition-transform duration-500 [transform-style:preserve-3d] ${fliped ? "[transform:rotateY(180deg)]" : ""}`}>
                <Card className="absolute inset-0 border-2 border-[var(--card-bottom-color)] bg-[var(--card-background)] p-4 [backface-visibility:hidden]">
                    <button type="button" onClick={()=> setfliped(true)} className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-3 text-center">
                       {icon}
                       <h3 className="font-bold">{title}</h3> 
                    </button>    
                </Card> 

                {/* Carta de atras*/}
                <Card className="absolute inset-0 flex items-center justify-center border-2 border-[var(--card-bottom-color)] bg-[var(--card-middle-background-color)] p-4 text-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    <div className="relative flex h-full w-full flex-col items-center justify-center gap-3">
                        <button type="button" onClick={() => setfliped(false)} aria-label="Volver al frente de la tarjeta" className="absolute inset-0 cursor-pointer"/>
                        <p className="pointer-events-none font-semi-bold text-sm">{description}</p>
                        <a href={href} className="relative z-10 rounded-xl bg-[var(--card-bottom-color)] px-4 py-2 font-semibold text-[var(--default-text-color)]">{name}</a>
                    </div>
                </Card>
            </div>
        </div>
    )
}