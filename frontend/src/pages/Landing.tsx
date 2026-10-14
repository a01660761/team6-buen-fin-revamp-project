// import { useState } from 'react';
import { Card,CardContent} from '@/components/ui/card';
import {Topbar} from "@/components/layout/Topbar";
import { Countdown } from '@/components/layout/Countdown';
import { CarouselPromotion} from '@/components/layout/Carousel'
import { AuthDialog } from '@/components/auth/AuthDialog';

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
                
                { /* Secciones */ }
                <section>

                </section>

            </main>
        </div>
    );
}