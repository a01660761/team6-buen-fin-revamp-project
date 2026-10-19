import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";

export function ThemeToggle(){
    const[dark, setDark] = useState(() => localStorage.getItem("theme") == "dark");

    useEffect(() => {
        document.documentElement.classList.toggle("dark", dark);
        document.documentElement.classList.toggle("light", !dark);

        localStorage.setItem("theme", dark ? "dark" : "light");
    }, [dark]);

    return(
        <Switch
            checked={dark} onCheckedChange={setDark} aria-label="Cambiar entre modo claro y oscuro" className="data-checked:bd-[var(--toggle-background-color)] data-unchecked:bg-[var(--toggle-background-color)]"
        />
    );
}