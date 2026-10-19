
import { useEffect, useRef, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";

const advertisements = Object.values(
  import.meta.glob<string>(
    "/src/assets/advertisements/*.{png,jpg,jpeg,webp,avif,gif}",
    {
      eager: true,
      query: "?url",
      import: "default",
    }
  )
);

export function CarouselPromotion() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const autoplay = useRef( // Conserva la misma instancia del autoplay entre renderizados
    Autoplay({
      delay: 6500,
      stopOnInteraction: false, // Carousel continue working after the last image
    })
  );

  useEffect(() => {
    if (!api) return;

    const update = () => {
      setCurrent(api.selectedScrollSnap());
    };

    update();
    api.on("select", update);
    api.on("reInit", update);

    return () => {
      api.off("select", update);
      api.off("reInit", update);
    };
  }, [api]);

  return (
    <div className="w-full min-w-0">

      <Carousel opts={{ loop: true }} plugins={[autoplay.current]} setApi={setApi} className="w-full">
        <CarouselContent>
          {advertisements.map((image, index) => (
            <CarouselItem key={image}>
              <div className="flex h-[350px] items-center justify-center overflow-hidden rounded-xl bg-[var(--card-background)] md:h-[450px]">
                <img
                  src={image}
                  alt={`Anuncio de El Buen Fin ${index + 1}`}
                  className="h-full w-full object-contain"
                />
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
          {advertisements.map((image, index) => (
            <button key={image} type="button" aria-label={`Ver anuncio ${index + 1}`} onClick={() => api?.scrollTo(index)} className={`h-3 w-3 rounded-full bg-[var(--carrousel-circles-color)] transition-opacity ${
                current === index ? "opacity-100" : "opacity-40"}`}/>
          ))}
        </div>
      )}

    </div>
  );
}
