import { SunMedium, SunMoon, CircleUser} from "lucide-react";
import { ThemeToggle} from "@/components/shared/ThemeToggle";
import buenFinLogo from "@/assets/tob_bar/buen_fin-removebg-previwe.png";

export function Topbar(){
    return (
        <header className= "sticky top-0 z-50 w-full bg-[var(--topbar-background-color)] text-[var(--default-text-color)] shadow-sm">
            <div className= "mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-5 px-5 lg:px-8">
                {/* Logo */}
                <a href="/Landing" className= "flex shrink-0 items-center gap-4">
                    <img src={buenFinLogo} alt="El Buen Fin" className="h-14 w-auto object-contain"/>
                    <span className= "hidden text-sm font-bold sm:block">
                        13 al 17 de Noviembre
                    </span>
                </a>

                {/* Botones de navegacion : Comercios/Consumidores*/}
                <nav className="ml-auto flex items-center gap-3">
                    <a href="/Consumidores" className="rounded-lg bg-[var(--bottoms-background-color)] px-5 py-2 font-semibold text-[var(--default-text-color)] hover:opacity-90">
                        Consumidores
                    </a>
                    <a href="/Comercios" className="rounded-lg bg-[var(--bottoms-background-color)] px-5 py-2 font-semibold text-[var(--default-text-color)] hover:opacity-90">
                        Comercios
                    </a>
                </nav>

                {/*Theme*/}
                <div className="topbar-theme">
                    <SunMedium size={24} />
                    <ThemeToggle/>
                    <SunMoon size={24} />    
                </div>  

                {/* Profile*/}
                <a href="/login" aria-label="Mi perfil">
                    <CircleUser size={32} />
                </a>
            </div>
        </header>
    );
}