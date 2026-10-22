// import { useState } from 'react';
import { Card,CardContent } from '@/components/ui/card';
import { UsersRound,BadgePercent, ShieldCheck, QrCode, LockKeyhole, ShieldAlert } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { Footer } from '@/components/layout/Footer';
import sorteophoto from '@/assets/photos_promotion/sorteo.png';
import consumidores_banner from '@/assets/photos_promotion/consumidores.jpg';
import soporte from '@/assets/photos_promotion/conciliacion.jpg';

export default function Consumidores(){
    return (
    <div className= "min-h-screen bg-[var(--background-color)] text-[var(--default-text-color-2)]">
        <Topbar/>

        <main className= "w-full px-4 py-8 sm:px-8 sm:py-12 lg:px-12">
            <h1 className='bg-[var(--card-title-background-color)] px-4 py-6 text-center text-2xl font-extrabold sm:px-10 sm:py-8 sm:text-3xl'>Consumidores</h1>
            
            <section className="mt-8 grid items-center gap-10 lg:grid-cols-2">
                <img src={consumidores_banner} alt="Compras durante El Buen Fin" className='h-auto w-full rounded-3xl object-contain'/>
                <div className="flex flex-col gap-5 rounded-3xl bg-[var(--background-cronometro-color)] p-8  shadow-sm">
                    <h2 className='text-2xl font-extrabold text-center text-[var(--default-text-color)]'>
                        Buscador de comercios participantes
                    </h2>
                    <label htmlFor='comercio' className="rounded-lg border-[var(--cronometro-text-color)] bg-[var(--contrast-color)] p-4 font-semibold text-center text-[var(--default-text-color)]">
                        Ingresa el nombre de la tienda física o en línea
                    </label>
                    <input id='comercio' name='comercio' type='search' placeholder='Ej. Aeroméxico...' className='w-full min-w-0 rounded-lg border-2 border-[var(--contrast-color)] bg-[var(--card-background)] p-3 text-[var(--button-text-color)] focus-visible:outline-2 focus-visible:outline-offset-2'/>
                    <div className='flex justify-center'>
                        <button type='button' className='rounded-md bg-[var(--contrast-color)] px-10 py-2 font-semibold text-[var(--default-text-color)]'>Buscar</button>
                    </div>
                 </div>
            </section >

            {/* Sorteo del SAT */}
            <section className=" mt-16 grid items-center gap-10 bg-[var(--card-middle-background-color)] p-8 lg:grid-cols-2">
                <div className="flex flex-col justify-center gap-6 text-center">
                    <h2 className="text-2xl font-extrabold leading-snug lg:text-3xl">
                        Compra con tarjeta este Buen Fin y gana hasta $250,000*
                    </h2>
                    <p className='text-base leading-relaxed lg:text-lg'>
                        Hay $400 millones de pesos en premios, y todas tus compras con pagos electrónicos participan. ¡Aprovecha!
                    </p>  
                    <a href='https://www.sat.gob.mx/minisitio/SorteoElBuenFin/index.html' target='_blank' rel='noopener noreferrer'
                    className='rounded-xl bg-[var(--topbar-background-color)] px-6 py-3 text-center text-lg font-semibold text-[var(--default-text-color)]'>
                        Conoce el Sorteo del SAT
                    </a>
                    <p className='text-center text-base'>
                        * Bases de participación del Sorteo El Buen Fin 2026
                    </p>  
                </div>
                <img src={sorteophoto} alt='Promocion del Sorteo El Buen Fin' className='h-auto w-full rounded-2xl object-contain'/>                                
            </section>
    
            {/* Recursos para consumidores */}
            <section className="mt-12 grid gap-8 p-8 lg:grid-cols-3">
                <h2 className='sr-only'>Recursos para consumidores</h2>
                <Card className="gap-0 rounded-2xl border-2 border-[var(--section-background-color)] bg-[var(--card-middle-background-color)] py-0 shadow-none">
                    <CardContent className="flex h-full flex-col items-center gap-7 p-8 text-center">
                        <UsersRound size={100} aria-hidden="true"/>
                        <h3 className="text-xl font-extrabold lg:text-2xl">
                            Profeco está de tu lado
                        </h3>
                        
                        <p className="text-base lg:text-lg leading-relaxed">
                            Haz valer tus derechos como consumidor durante El Buen Fin. Acércate a la Procuraduría Federal del Consumidor y denuncia cualquier mala práctica comercial que detectes
                        </p>

                        <a href='https://www.gob.mx/profeco' target="_blank" rel="noopener noreferrer" className="mt-auto w-full rounded-md bg-[var(--section-background-color)] px-4 py-4 text-base font-semibold text-[var(--default-text-color)]">
                            Visita el sitio de Profeco
                        </a>
                    </CardContent>
                </Card>

                <Card className="gap-0 rounded-2xl border-2 border-[var(--section-background-color)] bg-[var(--card-middle-background-color)] py-0 shadow-none">
                    <CardContent className="flex h-full flex-col items-center gap-4 p-5 text-center">
                        <BadgePercent size={100} />
                        <h3 className="text-xl font-extrabold lg:text-2xl">
                            ¿Quién es quién en los precios?
                        </h3>
                        <p className="text-base lg:text-lg leading-relaxed">
                            Toma mejores decisiones de compra con la información de precios de más de 3 mil productos de consumo regular en el hogar que Profeco recaba en establecimientos de todo México.
                        </p>

                        <a href='https://www.elbuenfin.org/assets/documents/D_Infografico_Quien_es_quien.png' className="mt-auto w-full rounded-md bg-[var(--section-background-color)] px-4 py-4 text-base font-semibold text-[var(--default-text-color)]">
                            Descarga esta infografía
                        </a>
                    </CardContent>
                </Card>

                <Card className="gap-0 rounded-2xl border-2 border-[var(--section-background-color)] bg-[var(--card-middle-background-color)] py-0 shadow-none">
                    <CardContent className="flex h-full flex-col items-center gap-4 p-5 text-center">
                        <ShieldCheck size={100} />
                        <h3 className="text-xl font-extrabold lg:text-2xl">
                            Derechos del consumidor
                        </h3>
                        <p className="text-base lg:text-lg leading-relaxed">
                            Infórmate y haz valer lo que por ley te corresponde al momento de comprar. Profeco ha preparado una infografía útil y clara sobre el tema que podrás consultar en todo momento.
                        </p>

                        <a href='https://www.elbuenfin.org/assets/documents/E_Infografico_Derechos_del_Consumidor.png' target="_blank" rel="noopener noreferrer" className="mt-auto w-full rounded-md bg-[var(--section-background-color)] px-4 py-4 text-base font-semibold text-[var(--default-text-color)]">
                            Descarga esta infografía
                        </a>
                    </CardContent>
                </Card>
            </section>

            {/* Conciliación */}
            <section className="mt-16 grid items-center gap-10 bg-[var(--background-color)] p-6 lg:grid-cols-2">
                <img src={soporte} alt="Atención y orientación al consumidor" className="aspect-[16/10] w-full rounded-3xl object-cover"/>

                <div className="flex flex-col gap-7">
                    <h2 className="text-center text-2xl font-extrabold leading-tight sm:text-3xl lg:text-5xl">
                        Resuelve controversias con Conciliaexprés
                    </h2>

                    <p className="text-center text-xl leading-relaxed lg:text-2xl font-semibold">
                        Si tienes inconvenientes con alguno de los comercios
                        participantes, podrás solucionarlos de forma ágil
                        a través de este programa.
                    </p>

                    <ol className="list-decimal space-y-6 pl-9 text-xl font-semibold leading-relaxed lg:text-2xl">
                        <li>
                            <a href="https://www.elbuenfin.org/assets/documents/F_Infografico_Conciliaexpres.pdf" className='hover:underline'>Descarga el infográfico con el paso a paso.</a>
                        </li>
                        <li>
                            <a href='https://telefonodelconsumidor.gob.mx/jsp/requerimientos-llamada.jsp' className='hover:underline'>Revisa la lista de proveedores inscritos.</a>
                        </li>
                        <li>
                            <a  href='https://consumidoras.profeco.gob.mx/conciliaexpress/solicitud.php' className='hover:underline'>Llena el formulario de solicitud de conciliación.</a>
                        </li>
                    </ol>
                </div>
            </section>

            {/* Compra con seguridad */}
            <section>
                <h2 className="mt-16 bg-[var(--card-title-background-color)] px-10 py-5 text-3xl font-extrabold text-[var(--section-background-color)]">
                    Compra con seguridad en El Buen Fin
                </h2>

                <div className="grid gap-6 p-10 sm:grid-cols-3">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <QrCode size={140} />
                        <a href="https://www.elbuenfin.org/assets/documents/GUIA_DE_USO_DEL_CODIGO_QR.pdf" target="_blank" rel="noopener noreferrer" className="text-xl font-semibold hover:underline lg:text-2xl">
                            Descarga la Guía de uso del QR
                        </a>
                    </div>

                    <div className="flex flex-col items-center gap-4 text-center">
                        <LockKeyhole size={140} />
                        <a href="/compra-segura" className="text-xl font-semibold hover:underline lg:text-2xl">
                            Obtén tips de seguridad
                        </a>
                    </div>

                    <div className="flex flex-col items-center gap-4 text-center">
                        <ShieldAlert size={140} />
                        <a href="/fraudes" className="text-xl font-semibold hover:underline lg:text-2xl"> {/* change the p to a to add the href*/}
                            Aprende a prevenir fraudes
                        </a>
                    </div>
                </div>
            </section>
        </main>
        <Footer/>
    </div>
    );
}