// import { useState } from 'react';
import { Topbar} from "@/components/layout/Topbar";
import { Footer } from '@/components/layout/Footer';
import bolsas from '@/assets/photos_promotion/bolsas.png';
import economia from '@/assets/photos_promotion/se.svg';
import margarita from '@/assets/photos_promotion/margarita.png';
export default function AcercaBuenFin(){
    return(
        <div className= "min-h-screen bg-[var(--background-color)] text-[var(--default-text-color-2)]">
            <Topbar/>
            <main className="w-full px-8 py-12 lg:px-12">
                <section className="grid items-start gap-12 lg:grid-cols-2">  
                    <div className='flex flex-col gap-6 rounded-2xl border-l-[12px] border-l-[var(--contrast-color)] bg-[var(--card-middle-background-color)] p-8'>
                        <h1 className='text-4xl font-semibold lg:text-5xl'>Acerca de El Buen Fin</h1>
                        <p className="text-lg leading-relaxed text-justify lg:text-xl">El Programa “El Buen Fin” surge de una{" "}
                            <a className='font-extrabold'>iniciativa de colaboración público-privada, con el objetivo de apoyar la economía familiar, incentivar la actividad del mercado interno y acrecentar el comercio formal</a>{" "}
                            así como garantizar el respeto a los derechos del consumidor.
                        </p>
                        <p className="text-lg leading-relaxed text-justify lg:text-xl">
                            En “El Buen Fin” participan por el{" "} 
                            <a className='font-extrabold'>Sector Público:</a>{" "} la Secretaría de Economía como Coordinadora del Programa, la Secretaría de Hacienda y Crédito Público (SHCP), la Secretaría de Turismo (SECTUR),
                            el Servicio de Administración Tributaria (SAT) y la Procuraduría Federal del Consumidor (PROFECO).
                        </p>
                        <p className="text-lg leading-relaxed text-justify lg:text-xl">
                            Por el{" "} 
                            <a className='font-extrabold'>Sector Privado</a>{" "} participan: el Consejo Coordinador Empresarial, A.C. (CCE), la Confederación de Cámaras Nacionales de Comercio, Servicios y Turismo de los 
                            Estados Unidos Mexicanos (CONCANACO SERVYTUR), la Asociación Nacional de Tiendas de Autoservicio y Departamentales, A.C. (ANTAD), la Asociación de Bancos de México ABM, A.C. (ABM), la Cámara Nacional
                            de la Industria de Radio y Televisión (CIRT), la Asociación Mexicana de Internet, A.C. (AIMX), y la Asociación Mexicana de Venta Online, A.C. (AMVO).
                        </p>
                    </div>

                    <div>
                        <img src={bolsas} alt='bolsas de compras de El Buen Fin' className='h-auto w-full rounded-3xl'/>
                    </div>
                </section>

                <section className='mt-12 w-full bg-[var(--card-background)] px-8 py-14'>
                    <p className='mx-auto max-w-6xl text-center text-xl leading-relaxed lg:text-2xl'>
                        “El Buen Fin” es un Programa que se inscribe en el marco del{" "}
                        <a className="font-extrabold">Plan México</a>{" "}
                        y que tiene como propósito final{" "}
                        <a className="font-extrabold"> fortalecer la PROSPERIDAD COMPARTIDA</a>, ya que, este Programa se ha consolidado como el principal impulsor de ventas año con año, en donde se ofertan la mayor cantidad de promociones y descuentos en productos 
                        y servicios en todo el territorio nacional.
                    </p>
                </section>

                <section className="mt-2 flex flex-col items-center justify-between gap-10 rounded-2xl px-10 py-10 md:flex-row">
                    <div className="flex flex-col items-center gap-3 md:items-start">
                        <img src={economia} alt="Secretaría de Economía" className='w-full max-w-[450px] object-contain'/>
                    </div>

                    <img src={margarita} alt='2026,Año de Margarita Maza' className="w-full max-w-[450px] object-contain"/>
                </section>
            </main>
            <Footer/>
        </div>
    );
}