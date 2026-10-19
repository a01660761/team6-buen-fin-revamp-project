// import { useState } from 'react';
import { Card,CardContent} from '@/components/ui/card';
import { UserRoundGroup, CalendarCheck, TrendingUp, ShoppingBag, Scale, ShoppingCart, Lightbulb, BellRing, Megaphone} from "lucide-react";
import {Topbar} from "@/components/layout/Topbar";
import { Footer } from '@/components/layout/Footer';
import { Countdown } from '@/components/layout/Countdown';
import { CarouselPromotion} from '@/components/layout/Carousel'
import { AuthDialog } from '@/components/auth/AuthDialog';
import { FlipCard } from '@/components/layout/FlipCard';
import { MarqueeComponent } from '@/components/layout/Merquee';
import inconvenientephoto from '@/assets/photos_promotion/inconveniente.jpg';

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

                {/* Merquee Component*/}
                <section className="w-full bg-[var(--mergue-background-color)] px-5 py-6">
                    <MarqueeComponent
                    tipo="comercios"
                    titulo="Algunos comercios participantes"
                    wide={120}
                    high={120}
                />
                </section>

                {/*Inconvenientes con un comercio */}
                <section className="mt-5 w-full bg-[var(--background-color)] px-6 py-10">
                    <div className= "mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-2">
                        {/* Columna izquierda */}
                        <div className="flex flex-col gap-5 lg:mr-12">
                            <h2 className="text-center text-2xl font-semibold text-[var(--default-text-color-2)] lg:text-3xl">
                               ¿Tuviste algún inconveniente con un comercio participante? 
                            </h2>

                            <Card className="gap-0 rounded-3xl border-0 border-l-[14px] border-l-[var(--topbar-background-color)] bg-[var(--card-middle-background-color)] shadow-none">
                                <CardContent className="p-6 text-center">
                                    <p className= "text-xl font-semibold text-[var(--default-text-color-2)]">
                                        Conciliaexprés es la manera más fácil y rápida de solucionar
                                        los problemas que surjan al momento de hacer tus compras.
                                    </p>
                                </CardContent>
                            </Card>

                            <div className="flex justify-center">
                                <button type="button" className="rounded-full border-2 border-[var(--contrast-color)] bg-[var(--topbar-background-color)] px-8 py-2 font-bold text-[var(--default-text-color)]">
                                    Todo sobre conciliación
                                </button>
                            </div>
                        </div>

                        {/* Columna derecha */}
                        <div>
                            <img src={inconvenientephoto} alt="Asesor atendiendo consultas" className="aspect-[16/10] w-full rounded-3xl border-[3px] border-[var(--contrast-color)] object-cover"/>
                        </div>
                    </div>
                </section>

                {/* Recursos para consumidores*/}
                <section className="mt-12 w-full bg-[var(--background-cronometro-color)]">
                    <div className="grid grid-cols-2 lg:grid-cols-4">

                        {/* Sorteo */}
                        <div className="flex flex-col items-center gap-4 bg-[var(--square-card-background-color)] p-6 text-center text-[var(--default-text-color)]">
                            <ShoppingBag size={64}/>
                            <h3 className="font-extrabold">Tus compras entran en el Sorteo El Buen Fin</h3>
                            {/* a href="" className */}
                            <a href="" className="mt-auto rounded-full bg-[var(--bottoms-background-color)] px-6 py-2 font-semibold">
                                Descubre cómo ganar
                            </a>
                        </div>

                        {/* Derechos como consumidro */}
                        <div className="flex flex-col items-center gap-4 bg-[var(--topbar-background-color)] p-6 text-center text-[var(--default-text-color)]">
                            <Scale size={64}/>
                            <h3 className="font-extrabold">Conoce tus derechos como consumidor</h3>
                            {/* a href="" className */}
                            <a href="" className="mt-auto rounded-full bg-[var(--bottoms-background-color)] px-6 py-2 font-semibold">
                                Descubrir
                            </a>
                        </div>

                        {/* Compras seguras */}
                        <div className="flex flex-col items-center gap-4 bg-[var(--square-card-background-color)] p-6 text-center text-[var(--default-text-color)]">
                            <ShoppingCart size={64}/>
                            <h3 className="font-extrabold">Aprende a comprar de forma segura</h3>
                            {/* a href="" className */}
                            <a href="" className="mt-auto rounded-full bg-[var(--bottoms-background-color)] px-6 py-2 font-semibold">
                                Descubrir
                            </a>
                        </div>

                        {/* Prevenir fraudes */}
                        <div className="flex flex-col items-center gap-4 bg-[var(--topbar-background-color)] p-6 text-center text-[var(--default-text-color)]">
                            <Lightbulb size={64}/>
                            <h3 className="font-extrabold">Tips para prevenir fraudes</h3>
                            {/* a href="" className */}
                            <a href="" className="mt-auto rounded-full bg-[var(--bottoms-background-color)] px-6 py-2 font-semibold">
                                Descubrir
                            </a>
                        </div>
                    </div>
                    
                    <a href='' className="mt-5 block w-full bg-[var(--bottoms-background-color)] px-8 py-4 text-lg font-bold text-[var(--default-text-color)] hover:opacity-90">
                        Recursos para consumidores
                    </a>
                </section >

                {/* Todo sobre el Buen Fin*/}
                <section className="mt-4 w-full bg-[var(--infro-title-background-color)]">
                    <h2 className="bg-[var(--infro-title-background-color)] px-10 py-5 text-2xl font-extrabold text[var(--section-background-color)]">
                        Todo sobre El Buen Fin
                    </h2>

                    <div className="grid gap-6 p-6 md:grid-cols-2 bg-[var(--info-background-color)]">
                        {/* Acerca del programa*/}
                        <Card className="gap-0 rounded-3xl border-2 bg-[var(--card-background) py-0 shadow-none">
                            <CardContent className="flex h-full flex-col items-center gap-3 p-6 text-center bg-[var(--infro-title-background-color)]">
                                <BellRing size={56}/>
                                <h3 className="text-xl font-extrabold">
                                    Acerca del programa
                                </h3>
                                <p className='text-sm font-semibold'>
                                    Conoce más sobre la campaña comercial más importante de México, donde miles de negocios ofrecen descuentos especiales
                                    para incentivar las compras y reactivar la economía.
                                </p>
                                <a href='' className="mt-auto rounded-full bg-[var(--section-background-color)] px-6 py-2 font-semibold text-[var(--default-text-color)]"> 
                                    Más sobre El Buen Fin
                                </a>
                            </CardContent>
                        </Card>

                        {/* Avisos*/}
                        <Card className="gap-0 rounded-3xl border-2 bg-[var(--card-background) py-0 shadow-none">
                            <CardContent className="flex h-full flex-col items-center gap-3 p-6 text-center bg-[var(--infro-title-background-color)]">
                                <Megaphone size={56}/>
                                <h3 className="text-xl font-extrabold">
                                    Avisos y noticias
                                </h3>
                                <p className='text-sm font-semibold'>
                                    Mantente informado con las últimas novedades, comunicados y actualizaciones oficiales relacionadas con El Buen Fin.
                                </p>
                                <a href='' className="mt-auto rounded-full bg-[var(--section-background-color)] px-6 py-2 font-semibold text-[var(--default-text-color)]"> 
                                    Ver avisos y noticias
                                </a>
                            </CardContent>
                        </Card>
                    </div>   
                </section>
                
                {/* Merge Component- Gobierno*/}
                <section className="mt-4 w-full bg-[var(--mergue-background-color)] px-5 py-6">
                    <MarqueeComponent
                    tipo="aliados"
                    titulo="Grupo de trabajo de El Buen Fin"
                    wide={250}
                    high={120}
                />
                </section> 
            </main>
            <Footer/>
        </div>
    );
}