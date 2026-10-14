import { useEffect, useState } from "react";
const targetDate = new Date("2026-11-13T00:00:00-06:00").getTime(); //Inicio de El Buen Fin 2026 (CST time)

function getTime(){
    const difference = Math.max(0,targetDate - Date.now());
    return{
        total:difference,
        days: Math.floor(difference / (1000 * 60 * 60 *24)),
        hours: Math.floor((difference / (1000 * 60 *60)) %24),
        minutes: Math.floor((difference / (1000 *60)) %60),
        seconds: Math.floor((difference / 1000) %60),
    };
}

export function Countdown(){
    const[time,setTime] = useState(getTime);
    
        useEffect(() => {
            const timer = window.setInterval(() => {
                setTime(getTime());
            }, 1000);
            return ()=> window.clearInterval(timer);
        }, []
    );

    const counters = [
        {label: "Días", value: time.days},
        {label: "Horas", value: time.hours},
        {label: "Minutos", value: time.minutes},
        {label: "Segundos", value: time.seconds},
    ];


    return(
        <div role="timer" aria-label= "Cuenta regresiva para El Buen FIn 2026" className="grid grid-cols-4 gap-2">
            {counters.map((counter)=> (
                <div key={counter.label} className="mx-auto flex aspect-square w-full max-w-36 flex-col items-center justify-center rounded-full border-[6px] border-[var(--contrast-color)] bg-[var(--elise-background-color)] px-1 text-center text-[var(--cronometro-text-color)]">
                    <span className="text-3xl font-extrabold leading-none tabular-nums md:text-4xl">
                        {String(counter.value).padStart(2,"0")}
                    </span>
                    <span className="mt-1 text-xs font-bold md:text-base">
                        {counter.label}
                    </span>
                </div>    
            ))}
        </div>
    );
}
