import { SunMedium, SunMoon, CircleUser} from "lucide-react";
import { ThemeToggle} from "@/components/shared/ThemeToggle";
import buenFinLogo from "@/assets/top_bar/logo.png";

export function Topbar(){
    return (
        <header className= "sticky top-0 z-50 w-full bg-[var(--topbar-background-color)] text-[var(--default-text-color)] shadow-sm">
            <div className= "flex min-h-20 w-full items-center gap-5 px-5 lg:px-8">
                {/* Logo */}
                <a href="/Landing" className= "flex shrink-0 items-center gap-4">
                    <img src={buenFinLogo} alt="El Buen Fin" className="h-14 w-auto object-contain"/>
                    <span className= "hidden text-sm font-bold md:block md:text-lg">
                        13 al 17 de Noviembre
                    </span>
                </a>

                {/* Botones de navegacion : Comercios/Consumidores*/}
                <nav className="ml-auto flex items-center gap-4">
                    <a href="/Consumidores" className="rounded-lg bg-[var(--bottoms-background-color)] px-5 py-2 font-semibold text-[var(--default-text-color)] hover:opacity-90">
                        Consumidores
                    </a>
                    <a href="/Comercios" className="rounded-lg bg-[var(--bottoms-background-color)] px-5 py-2 font-semibold text-[var(--default-text-color)] hover:opacity-90">
                        Comercios
                    </a>
                </nav>

                {/*Theme*/}
                <div className="flex items-center gap-3">
                    <SunMedium size={38} />
                    <ThemeToggle/>
                    <SunMoon size={38} />    
                </div>  

                {/* Profile*/}
                <a href="/login" aria-label="Mi perfil">
                    <CircleUser size={38} />
                </a>
            </div>
        </header>
    );
}