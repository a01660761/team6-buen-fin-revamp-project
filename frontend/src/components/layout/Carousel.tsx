
import { useEffect, useRef, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";

/*
ChatGPT-6 Luna se utilizo para lo siguiente:
Como herramienta de apoyo para implementar y comprender como es que funciona el componente del carrusel.
- Su principal utilizacipn fue en ** import.meta.glob ** para lograr importar automaticamente las imagenes que se encuentran en una carpeta en especifico.
También se consulto el uso de useRef para conservar la instancia de autoplay y useEffect para sincronizar el indicador.
- Se recibio orientación y ayuda para entender los indicadores de navegación mediante .map()
--------------------------------
- import.meta.glob() : Encuentra los archivos que coinciden con un patron
- opts: permiter configurar el comportamiento del carrusel
- loop : true : permite que el carrusel avance de la ultima imagen y viceversa
- plugins={[autoplay.current]} pluging de reproducción automática.
- plugin: recibe un arreglo 
*/

const advertisements = Object.values( // Convierte los resultados en arreglos url
  import.meta.glob<string>( 
    "/src/assets/advertisements/*.{png,jpg,jpeg,webp,avif,gif}", // Permite varios formatos de imagen
    {
      eager: true, //Importa los archivos inmediatamente
      query: "?url", // solicita la url de cada imagen
      import: "default", //obtiene la exportación principal de cada archivo
    }
  )
);

export function CarouselPromotion() {
  const [api, setApi] = useState<CarouselApi>(); // Controla el carrousel y guarda las instancias
  const [current, setCurrent] = useState(0); // índice actial y la otra funcion actualiza el indice , el (0) es la primera imagen

  const autoplay = useRef( // Conserva la misma instancia del autoplay entre renderizados
    Autoplay({
      delay: 6500, // Tiempo en el que se mueve de manera automatica
      stopOnInteraction: false, // Carousel continue working after the last image
    })
  );

  useEffect(() => {
    if (!api) return;

    const update = () => {
      setCurrent(api.selectedScrollSnap()); // Devuelve el indice de la imagen.
    };

    update();
    api.on("select", update); //select: se ejecuta cuando cambia la imagen selecionada
    api.on("reInit", update); // reInit: se ejecuta cuando Embla reinicializa el carrusel ante ciertos cambios en el tamaño

    return () => {
      api.off("select", update);
      api.off("reInit", update);
    };
  }, [api]);

  return (
    <div className="w-full min-w-0">

      <Carousel opts={{ loop: true }} plugins={[autoplay.current]} setApi={setApi} className="w-full"> 
        <CarouselContent>
          {advertisements.map((image, index) => ( //.map recorre el arregle de imagenes y genera un carrousel item para cada una
            <CarouselItem key={image}> {/*key = ayuda a identificar cada elemento de la lista*/}
              <div className="flex h-[350px] items-center justify-center overflow-hidden rounded-xl bg-[var(--card-background)] md:h-[450px]">
                <img src={image} alt={`Anuncio de El Buen Fin ${index + 1}`} className="h-full w-full object-contain"/>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {advertisements.length > 1 && (
          <>
            <CarouselPrevious className="left-3" />
            <CarouselNext className="right-3" />
          </>
        )}
      </Carousel>

      {/* Puntitos indicadores */}
      {advertisements.length > 1 && (
        <div className="mt-4 flex justify-center gap-3">
          {advertisements.map((image, index) => (<button key={image} type="button" aria-label={`Ver anuncio ${index + 1}`} onClick={() => api?.scrollTo(index)} className={`h-3 w-3 rounded-full bg-[var(--carrousel-circles-color)] transition-opacity ${current === index ? "opacity-100" : "opacity-40"}`}/>))}
        </div>
      )}

    </div>
  );
}
