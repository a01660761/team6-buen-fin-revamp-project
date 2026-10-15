// import { useState } from 'react';
import { Card,CardContent} from '@/components/ui/card';
import { UserRoundGroup, CalendarCheck, TrendingUp } from "lucide-react";
import {Topbar} from "@/components/layout/Topbar";
import { Countdown } from '@/components/layout/Countdown';
import { CarouselPromotion} from '@/components/layout/Carousel'
import { AuthDialog } from '@/components/auth/AuthDialog';
import { FlipCard } from '@/components/layout/FlipCard';

export default function Landing() {
    return (
        <div className= "min-h-screen bg-[var(--background-color)]">
            <Topbar/>

            <main className= "mx-auto max-w-10x1 px-6 py-12">
                <section className="grid gap-6 lg:grid-cols-3">
                    
                    { /* Carrusel */ }
                    <div className="min-w-0 lg:col-span-2">
                        <CarouselPromotion/>
                    </div>

                    { /* Contador */ }
                    <div className= "flex flex-col gap-4">
                        <Card className="bg-[var(--background-cronometro-color)] text-[var(--default-text-color)] ">
                            <CardContent>
                            <h1 className="mb-5 text-left text-xl lg:text-2xl font-extrabold">
                                ¡ Cada día más cerca El Buen Fin 2026 !
                            </h1>
                            <Countdown/>
                            </CardContent>
                        </Card>

                        { /* Carta */}
                        <Card className="bg-[var(--card-background)] text-[var(--default-text-color-2)]">
                            <CardContent className="p-6">
                                <h2 className= "text-xl font-bold">
                                    ¿Quieres participar en el Buen Fin 2026?
                                </h2>
                                <p className= "mt-2 text-sm">
                                    Crea una cuenta o inicia sesión para registrar tu empresa
                                </p>

                                <div className="mt-4 flex-wrap grap-3">
                                    <AuthDialog/>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>
                
                { /* Sección Comercios*/ }
                <section className="mt-12 w-full bg-[var(--card-title-background-color)]">
                    <h2 className="px-10 py-5 text-2xl font-extrabold text-[var(--section-background-color)] lg:text-2xl">
                        Comercios
                    </h2>
                    <div className="grid grid-cols-2 lg:grid-cols-3">
                        <div className="bg-[var(--card-background)] p-6">
                            <FlipCard 
                                title="Forma parte de El Buen Fin"
                                icon={<UserRoundGroup size={64}/>}
                                description="Impulsa las ventas de tu comercio durante el fin de semana más dinámico para el mercado doméstico mexicano. 
                                Regístrate a partir del 8 de septiembre del 2026, es totalmente gratuito."
                                href='' //Todavía no se tiene el apartado de Recursos 
                                name='Recursos'
                            />
                        </div>

                        <div className='bg-[var(--card-middle-background-color)] p-6'>
                            <FlipCard 
                                title="Gana con el Sorte El Buen Fin"
                                icon={<CalendarCheck size={64}/>}
                                description="Aprovecha los premios que el Servicio de Administración Tributaria ofrece a los comercios participantes.
                                Hay $100,000,000 pesos en premios."
                                href='' //Todavía no se tiene el apartado de Recursos 
                                name="Leer las bases"
                            />
                        </div>

                        <div className="bg-[var(--card-background)] p-6">
                            <FlipCard 
                                title="Haz crecer tu comercio"
                                icon={<TrendingUp size={64}/>}
                                description="Utiliza las herramientas gratuitas y de dominio público que el programa MIPYMES MX de la Secretaría de Economía ha preparado para ti."
                                href='' //Todavía no se tiene el apartado de Recursos 
                                name="Ir a MIPyMES MX"
                            />
                        </div>
                    </div>
                    
                    <p className="px-10 py-4 text-m font-semibold italic"> 
                        Gira las tarjetas {""}
                        <a className='font-normal'>
                            para obtener más información 
                        </a> 
                    </p>
                </section >

                <section className="mt-4 w-full bg-[var(--searching-background-color)]">
                    <h2 className="px-10 py-5 text-2xl font-extrabold text-[var(--section-background-color)] lg:text-2xl">
                        Consumidores
                    </h2>

                    <div className="bg-[var(--section-background-color)] text-center">
                        <div className="mx-auto grid max-w-3xl gap-4 px-5 py-10">
                            <h1 className="text-xl font-extrabold text-[var(--default-text-color)] ">
                                Buscador de comercios participantes
                            </h1>
                            <label htmlFor="store" className="font-bold text-[var(--default-text-color)]">
                                Ingresa el nombre de la {" "}
                                <a className="underline font-bold">
                                    tienda fisica 
                                </a> {" "} o {" "}
                                <a className="underline font-bold">
                                    en línea
                                </a>
                            </label>
                            <div className="flex item-center gap-4">
                                <input type="text" id="store" name="store" placeholder="Ej. Aeromexico ..." className="min-w-0 flex-1 rounded-lg border p-4 bg-[var(--title-background-color)] text-[var(--section-background-color)]"/>
                                <button type="button" className="shrink-0 w-28 rounded-xl bg-[var(--button-bakcgorund-color-2)] p-3 font-semibold text-[var(--button-text-color)] border p-0.5 border-[var(--button-background-color)]">
                                    Buscar
                                </button>
                            </div>      
                        </div>
                    </div>
                </section>

                {/* Merge Component*/}


            </main>
        </div>
    );
}