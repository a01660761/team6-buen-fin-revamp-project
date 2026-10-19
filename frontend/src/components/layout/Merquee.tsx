/* */
const folders = {
    comercios:Object.values(
        import.meta.glob<string>(
            "../../assets/business/*.{png,jpg,jpeg,webp,svg}",
            {eager:true, query: "?url", import:"default"} 
        )
    ),

    aliados:Object.values(
        import.meta.glob<string>(
            "../../assets/alies/*{png,jpg,jpeg,webp,svg}",
            {eager:true, query:"?url", import:"default"}
        )
    ),
};

type MarqueeProps = { 
    tipo: keyof typeof folders; //
    titulo: string;
    high: number;
    wide: number;
};

export function MarqueeComponent({tipo,titulo, high=90, wide=90}: MarqueeProps){
    const logos = folders[tipo]

    if(logos.length===0) return null;

    return(
        <section className="w-full bg-[var(--mergue-background-color]) px py-6">
            <h2 className="mb-5 text-center text-xl font-extrabold">{titulo}</h2>
            <div className="overflow-hidden">
                <div className="flex w-max animate-[marquee_85s_linear_infinite] hover:[animation-play-state:paused">
                    {[0,1].map((copia)=>(
                        <div key={copia} aria-hidden={copia ===1} className="flex shrink-0 items-center gap-6 pr-6">
                            {logos.map((logo,index) =>(
                                <img key={logo} src={logo} alt={copia ===1?"" : `${titulo} ${index + 1}`} style={{width:wide, height:high}}
                                className="shrink-0 rounded-xl bg-white p-2 object-contain"/>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}