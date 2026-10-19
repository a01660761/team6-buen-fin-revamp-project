import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Registro } from "./Registro";
import { Login } from "./Login";

export function AuthDialog() {
  return (
    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
      <Dialog>
        <DialogTrigger render={
          <Button variant="outline" className="w-full bg-[var(--topbar-background-color)] text-[var(--default-text-color)] sm:flex-1">
            Crear una cuenta
          </Button>}/>
          <DialogContent className="max-h-[90dvh] overflow-y-auto bg-[var(--card-background-2)] sm:max-w-2xl">
            <Registro/>
          </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger render={
          <Button variant="outline" className="w-full bg-[var(--topbar-background-color)] text-[var(--default-text-color)] sm:flex-1">
            Iniciar sesión
          </Button>}/>
          <DialogContent className="max-h-[90dvh] overflow-y-auto bg-[var(--card-background-2)] sm:max-w-2xl">
            <Login/>
          </DialogContent>
      </Dialog>
    </div>
  );
}