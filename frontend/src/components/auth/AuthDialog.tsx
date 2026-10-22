import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Registro } from "./Registro";
import { Login } from "./Login";

/*
ChatGPT-6 Luna se utilizo para lo siguiente:
- Tailwind CSS (sr-only, max-h[90dvh], w-[calc(100vw-2rem)], overflow-y-auto)
- Se utlizo para agregar la accesibilidad para lectores de pantalla
-----------
-sr-only : Oculta el título, permite que los lectores de pantalla lo anuncien
- max-h-[90dvh] y w-[calc(100vw-2rem)]: para que no se salgan de la pantalla del celular
  -max limita la altura a un 90% de la pantalla visible
-overflow-y-auto : permite el desplazamiento de formularios largos
- p-4 sm: p-6 : menos espacio interior en celular, más en computadora.
*/

export function AuthDialog() {
  return (
    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
      <Dialog>
        <DialogTrigger render={
          <Button variant="outline" className=" min-h-11 w-full bg-[var(--topbar-background-color)] text-[var(--default-text-color)]">
            Crear una cuenta
          </Button>}/>
          <DialogContent className="max-h-[90dvh] w-[calc(100vw-2rem)] overflow-y-auto bg-[var(--card-background-2)] p-4 sm:max-w-2xl sm:p-6">
            <DialogTitle className="sr-only">
              Crear una cuenta en El Buen Fin
            </DialogTitle>
            <Registro/>
          </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger render={
          <Button variant="outline" className="min-h-11 w-full bg-[var(--topbar-background-color)] text-[var(--default-text-color)]">
            Iniciar sesión
          </Button>}/>
          <DialogContent className="max-h-[90dvh] w-[calc(100vw-2rem)] overflow-y-auto bg-[var(--card-background-2)] p-4 sm:max-w-2xl sm:p-6">
            <DialogTitle className="sr-only">
              Iniciar sesión en El Buen Fin
            </DialogTitle>
            <Login/>
          </DialogContent>
      </Dialog>
    </div>
  );
}