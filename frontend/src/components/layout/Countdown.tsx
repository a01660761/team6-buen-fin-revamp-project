import { useEffect, useState } from "react";
/*
ChatGPT-6 Luna se utilizo para lo siguiente:
Como herramienta de apoyo para implementar y comprender como es que funcionan los cronometros
-------
Math.floor : Se utiliza para cada unidad de tiempo. Además de que redondea un número hacia abajo al entero más cercano.
window.setInterval : Ejecuta la función repetidamente, aproximadamente cada cierto tiempo
padStarrt
*/

const targetDate = new Date("2026-11-13T00:00:00-06:00").getTime(); //Inicio de El Buen Fin 2026 (CST time)

function getTime(){
    const difference = Math.max(0,targetDate - Date.now()); // evita que muestre valores negativos cuando llegue a la fecha
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
            const timer = window.setInterval(() => { //Ejecuta la actualización cada segundo
                setTime(getTime()); // Calcula los días, horas, minutos y segundos restantes y actualiza el estado de React
            }, 1000);
            return ()=> window.clearInterval(timer); // detiene el intervalo cuando se desmota el componente, para evitar que se ejecute  innecesariamente
        }, []
    );

    const counters = [
        {label: "Días", value: time.days},
        {label: "Horas", value: time.hours},
        {label: "Minutos", value: time.minutes},
        {label: "Segundos", value: time.seconds},
    ];


    return(
        <div role="timer" aria-label= "Cuenta regresiva para El Buen FIn 2026" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {counters.map((counter)=> (
                <div key={counter.label} className="mx-auto flex aspect-square w-full max-w-36 flex-col items-center justify-center rounded-full border-[6px] border-[var(--contrast-color)] bg-[var(--elise-background-color)] px-1 text-center text-[var(--cronometro-text-color)]">
                    <span className="text-2xl font-extrabold leading-none tabular-nums sm:text-3xl">
                        {String(counter.value).padStart(2,"0")}
                    </span>
                    <span className="mt-1 text-[10px] font-bold sm:text-xs">
                        {counter.label}
                    </span>
                </div>    
            ))}
        </div>
    );
}
