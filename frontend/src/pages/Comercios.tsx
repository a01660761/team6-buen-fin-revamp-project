// import { useState } from 'react';
import { Card,CardContent} from '@/components/ui/card';
import { Dialog, DialogTrigger, DialogTitle, DialogContent } from "@/components/ui/dialog";
import { Files, MailOpen, Store, Settings, Scale, Mail} from "lucide-react";
import {Topbar} from "@/components/layout/Topbar"; 
import { Footer } from '@/components/layout/Footer';
import sorteophoto from '@/assets/photos_promotion/sorteo.png';
import comercio_banner from '@/assets/photos_promotion/comercios.jpg';
import { Registro } from '@/components/auth/Registro';
export default function Comercios(){
    return (
        <div className= "min-h-screen bg-[var(--background-color)] text-[var(--default-text-color-2)]">
            <Topbar/>
    
            <main className= "w-full px-4 py-8 sm:px-8 sm:py-12 lg:px-12">
                <h1 className='bg-[var(--card-title-background-color)] px-10 py-8 text-center text-3xl font-extrabold'> Comercios</h1>
                
                <section className="mt-8 grid items-center gap-10 lg:grid-cols-2">
                    <img src={comercio_banner} alt="Comerciante preparando pedidos" className='h-auto w-full rounded-3xl object-contain'/>
                    <div className='flex flex-col gap-5'>
                        <Card className='border-0 bg-[var(--card-middle-background-color)] shadow-none'>
                            <CardContent className='p-8 text-center'>
                                <p className='text-xl font-semibold leading-relaxed lg:text-2xl'>
                                    ¿Ya registraste tu comercio en el programa El Buen Fin? Hazlo a partir del 8 de septiembre de 2026 e impulsa tu negocio. 
                                </p>
                            </CardContent>
                        </Card>
                        <Dialog>
                            <DialogTrigger render={
                                <button type="button" className="rounded-xl bg-[var(--topbar-background-color)] px-6 py-3 text-center text-lg font-bold text-[var(--default-text-color)]">
                                    Registrar
                                </button>
                                }
                            />

                            <DialogContent className="max-h-[90dvh] w-[calc(100vw-2rem)] overflow-y-auto bg-[var(--card-background-2)] sm:max-w-lg">
                                <DialogTitle className='sr-only'>
                                    Registro de usuario
                                </DialogTitle>
                                <Registro />
                            </DialogContent>
                        </Dialog>
                        <a href='/preguntas-frecuentes' className='rounded-xl bg-[var(--topbar-background-color)] px-6 py-3 text-center text-lg font-bold text-[var(--default-text-color)]'>Preguntas frecuentes</a>
                    </div>
                </section >

                {/* Sorteo del SAT */}
                <section className="mt-16 grid items-center gap-10 bg-[var(--card-middle-background-color)] p-8 lg:grid-cols-2">
                    <div className="flex flex-col justify-center gap-6 text-center">
                        <h2 className="text-2xl font-extrabold leading-snug lg:text-3xl">
                            Con tu registro a El Buen Fin puedes entrar al Sorteo del SAT
                        </h2>
                        <p className='text-base leading-relaxed lg:text-lg'>
                            Todas tus ventas de más de $250 pesos* en pagos electrónicos participan. 
                            Hay $500 millones de pesos en premios, que tú y tus clientes pueden ganar.
                        </p>  
                        <a href='https://www.sat.gob.mx/minisitio/SorteoElBuenFin/index.html' target='_blank' rel='noopener noreferrer'
                        className='rounded-xl bg-[var(--topbar-background-color)] px-6 py-3 text-center text-lg font-semibold text-[var(--default-text-color)]'>Conoce el Sorteo del SAT</a>
                        <p className='text-center text-base'>
                            * Bases de participación del Sorteo El Buen Fin 2026
                        </p>  
                    </div>
                    <img src={sorteophoto} alt='Promocion del Sorteo El Buen Fin' className='w-full rounded-3xl object-contain'/>                                
                </section>

                {/*Infografías*/}
                <section className='mt-12 grid gap-8 px-5 py-8 lg:grid-cols-3'>
                    <div className='flex flex-col items-center gap-5 text-center'>
                        <div className='flex min-h-64 w-full flex-col items-center justify-center gap-6 rounded-2xl border-2 border-[var(--section-background-color)] p-8'>
                            <Files size={100}/>
                            <h3 className='text-xl font-extrabold lg:text-2xl'>Aclara las inconsistencias</h3>
                        </div>
                        <a href='https://www.elbuenfin.org/assets/documents/I_Aclara_las_incosistencias.png' className='w-full rounded-md bg-[var(--section-background-color)] px-4 py-4 text-base font-semibold text-[var(--default-text-color)]'>Descarga esta infografía</a>
                    </div>

                    <div className='flex flex-col items-center gap-5 text-center'>
                        <div className='flex min-h-64 w-full flex-col items-center justify-center gap-6 rounded-2xl border-2 border-[var(--section-background-color)] p-8'>
                            <MailOpen size={100}/>
                            <h3 className='text-xl font-extrabold lg:text-2xl'>Habilita tu Buzón Tributario</h3>
                        </div>
                        <a href='https://www.elbuenfin.org/assets/documents/J_Habilita_el_buzon_tributario.png' className='w-full rounded-md bg-[var(--section-background-color)] px-4 py-4 text-base font-semibold text-[var(--default-text-color)]'>Descarga esta infografía</a>
                    </div>

                    <div className='flex flex-col items-center gap-4 text-center'>
                        <div className='flex min-h-64 w-full flex-col items-center justify-center gap-6 rounded-2xl border-2 border-[var(--section-background-color)] p-8'>
                            <MailOpen size={100}/>
                            <h3 className='text-xl font-extrabold lg:text-2xl'>Obtén tu Opinión de cumplimiento</h3>
                        </div>
                        <a href='https://www.elbuenfin.org/assets/documents/K_Obten_tu_opinion_del_cumplimiento.png' className='w-full rounded-md bg-[var(--section-background-color)] px-4 py-4 text-base font-semibold text-[var(--default-text-color)]'>Descarga esta infografía</a>
                    </div>
                </section>

                {/* Haz crecer tu comercio */}
                <section className='mt-16'>
                    <h2 className='bg-[var(--card-title-background-color)] px-10 py-5 text-3xl font-extrabold'>Haz crecer tu comercio creza</h2>
                    <div className='grid gap-2 lg:grid-cols-2'>
                        <div className='flex flex-col items-center gap-6 bg-[var(--card-middle-background-color)] p-8 text-center'>
                           <div className='relative'>
                                <Store size={100}/>
                                <Settings size={36} className='absolute -bottom-2 -right-4'/>
                            </div>

                            <h3 className='text-xl font-extrabold lg:text-2xl'>
                                Aprovecha los recursos de MIPYMES MX
                            </h3>
                            <p className='text-base leading-relaxed lg:text-lg'>
                                Cursos, herramientas, guías e información útil para tu micro, pequeña o mediana empresa es todo lo que encontrarás en el portal oficial del programa de Secretaría de Economía especializado en los negocios que mueven a México.
                            </p>
                            <a href='https://mipymes.economia.gob.mx' target='_blank' rel='noopener noreferrer' className='mt-auto w-full rounded-md bg-[var(--section-background-color)] px-6 py-4 text-lg font-semibold text-[var(--default-text-color)]'>Visita el portal</a>
                        </div>

                        <div className='flex flex-col items-center gap-6 bg-[var(--card-middle-background-color)] p-8 text-center'>
                            <Store size={100}/>
                            <h3 className='text-xl font-extrabold lg:text-2xl'>
                                Fortalece tu MIPYME 
                            </h3>
                            <p className='text-base leading-relaxed lg:text-lg'>
                                Si tu empresa está a punto de dar el salto hacia el siguiente nivel, la Ventanilla Única para Micro, Pequeñas y Medianas Empresas te ofrece los recursos que te ayudarán a conseguirlo. Ve por ellos.
                            </p>
                            <a href="https://ventanillamipymes.economia.gob.mx/fortalecer-empresa/?filtros" className='mt-auto w-full rounded-md bg-[var(--section-background-color)] px-6 py-4 text-lg font-semibold text-[var(--default-text-color)]'>Visita la Ventanilla Única de Mipymes</a>
                        </div>
                    </div>
                    
                </section>
                        
                {/* Vende mejor */}
                <section className='mt-12'>
                    <h2 className='bg-[var(--card-title-background-color)] px-10 py-5 text-3xl font-extrabold'>Vende mejor con El Buen Fin</h2>
                    <div className='grid gap-10 p-4 sm:grid-cols-2 sm:p-8'>
                        <div className='flex flex-col items-center gap-6 text-center'>
                            <Scale size={120}/>
                            <a href='https://www.elbuenfin.org/assets/documents/GUIA_DE_USO_DEL_CODIGO_QR.pdf' className='text-xl font-semibold hover:underline lg:text-2xl'>Revisa la guía de uso del QR obligatorio</a>
                        </div>
                        <div className='flex flex-col items-center gap-6 text-center'>
                            <Mail size={120}/>
                            <a href="https://www.gob.mx/profeco/articulos/codigo-de-etica-en-materia-de-comercio-electronico?idiom=es" className='text-xl font-semibold hover:underline lg:text-2xl'>Conoce el código de ética del comercio electrónico</a>
                        </div>
                    </div>      
                </section>
            </main>
            <Footer/>
        </div>
    );
}