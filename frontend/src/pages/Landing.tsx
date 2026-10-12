import { Button } from '@/components/ui/button'
import { Card,CardContent} from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../components/ui/carousel'

import {Topbar} from "@/components/layout/Topbar";

const advertisements = Object.values(
    import.meta.glob<string>(
        "/scr/assets/advertisements/* .[png.jpeg]",
        {
            eager: true,
            query: "?url",
            import: "default",
        }
    )
);

export default function Landing() {
    return (
        <div className= "min-h-screen bg-[var(--background-color)]">
            <Topbar/>

            <main className= "mx-auto max-w-7x1 px-6 py-12">
                <section className="grid gap-6 lg:grid-cols-3">
                    
                    { /* Carrusel */ }
                    <div className="lg:col-span-2">
                        <Carousel opts={{loop:true}}>
                            
                            <CarouselContent>
                                {advertisements.map((image, index) => (
                                    <CarouselItem key={image}>
                                        <div className= "flex h-80 items-center justify-center rounded-x1 bg-[var(--card-background)] md:h-96">
                                            <img src={image} alt={`Anuncio de El Buen Fin ${index + 1}`} className="h-full w-full object-cover"/>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            {advertisements.length > 1 && (
                                <>
                                    <CarouselPrevious className="left-3"/>
                                    <CarouselNext className="right-3"/>
                                </>
                            )}
                        </Carousel>
                    </div>

                    { /* Contador */ }
                    <div className= "flex flex-col gap-4">
                        <Card className="bg-[var(--background-cronometro-color)] text-[var(--default-text-color)]">
                            <CardContent>
                            <h2> ¡Cada día más cerca</h2>
                            <h2> El Buen Fin 2026 </h2>

                            {/* Agregar el contador*/}

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
                                    {/*Iniciar Y crear cuenta */}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>
                
                { /* Secciones */ }

            </main>
        </div>
    );
}