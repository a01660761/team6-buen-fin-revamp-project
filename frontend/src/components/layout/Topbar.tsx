import { SunMedium, SunMoon, CircleUser} from "lucide-react";
import { ThemeToggle} from "@/components/shared/ThemeToggle";
import buenFinLogo from "@/assets/top_bar/logo.png";
// import { useState } from "react";
import { useEffect, useState } from "react";
import { authProvider } from "@/AuthProvider";
import { getCurrentUser, TOKEN_KEY } from "@/apiClient";
import { Dialog, DialogContent, DialogTitle} from '@/components/ui/dialog';
import { Login } from "../auth/Login";
import { DatosCuenta } from "./DatosCuenta";
/*

ChatGPT-6.1 Sol was used to review, validate and improve the code.

ChatGPT-6 Luna se utilizo para lo siguiente:
- Tailwind CSS (sticky, shadow-sm, order-1, hidden, z-50focus-visible:outline-offset-4)
- Se utilizo para renderizar las condiciones en React como "Type Props" y en Dialog
- Se utlizo para corregir los errores de sintaxis (typos)
-----------
- sticky: Para que el elemento se mantenga visibla al desplazarse
- z-50 : Para aparezca por encima de los otros elementos
- shadow-sm: Sombra discreta
- orden : Ayudan a controlar el orden visual en el dispositivo
- hidden: oculto al inicio
- lg:block: visible a partir de 1024 px.
- focus-visible:outline-offset : Para accesibilidd- con el objetivo que logre identificar mejor cual es el elemento que se este seleccionando mediante teclado
- <detail className="relative"> <summar>: para crear contenido despegable, summary= elemento que se presiona y abre nuestro menu despegable, relative= permite que un elemento se posicione
- Type Props = propiedades que acepta un componente
- max-h-[90dvh] y w-[calc(100vw-2rem)]: para que no se salgan de la pantalla del celular

*/



type UsuarioActual = Awaited<ReturnType<typeof getCurrentUser>>; // reutilizes the structure that returns the route of /user/me, including the properties of the user object

export function Topbar() {
    const[loginAbierto, setLoginAbierto] = useState(false);
    const[misDatosAbierto, setMisDatosAbierto] = useState(false);

    const [usuario, setUsuario] = useState<UsuarioActual | null>(null); // null = no hay usuario logueado
    const [verificandoSesion, setVerificandoSesion] = useState(true);
    const [cerrandoSesion, setCerrandoSesion] = useState(false);
    const [errorSesion, setErrorSesion] = useState("");

    useEffect(() => {
        let activo = true;

        async function verificarSesion() {
            if (!activo) return;

            setErrorSesion("");

            if (!sessionStorage.getItem(TOKEN_KEY)) {
                setUsuario(null);
                setVerificandoSesion(false);
                return;
            } // if it doesn't receive a token, the user is no longer logged

            setVerificandoSesion(true);

            try {
                const usuarioActual = await getCurrentUser();

                if (activo) {
                    setUsuario(usuarioActual);
                }
            }

            catch (errorRecibido) {
                if (!activo) return;

                const estado = (
                    errorRecibido as { status?: number }
                ).status;

                if (estado === 401) {
                    sessionStorage.removeItem(TOKEN_KEY);
                    setUsuario(null);
                } // if the token is invalid, remove it and set the user to null

                else {
                    setErrorSesion(
                        "No pudimos verificar tu sesión. Comprueba la conexión y recarga la página."
                    );
                }
            }

            finally {
                if (activo) {
                    setVerificandoSesion(false);
                }
            }
        }

        void verificarSesion();

        function alRecuperarFoco() {
            void verificarSesion();
        } // when the user returns to the page, it checks if the session is still valid and updates the state accordingly

        window.addEventListener("focus", alRecuperarFoco);

        return () => {
            activo = false;
            window.removeEventListener("focus", alRecuperarFoco);
        };
    }, []);

    async function cerrarSesion() {
        if (cerrandoSesion) return;

        setCerrandoSesion(true);

        try {
            await authProvider.logout({});
        }

        finally {
            window.location.assign("/");
        } // if the user logs out, it redirects to the home page
    }

    return (
        <header className= "sticky top-0 z-50 w-full bg-[var(--topbar-background-color)] text-[var(--default-text-color)] shadow-sm">
            <div className="flex w-full flex-wrap items-center gap-3 px-3 py-3 sm:flex-nowrap sm:px-5 lg:px-8">
                {/* Logo */}
                <a href="/" className= "order-1 flex shrink-0 items-center gap-4">
                    <img src={buenFinLogo} alt="El Buen Fin" className="h-14 w-auto object-contain"/>
                    <span className= "hidden text-sm font-bold md:block md:text-lg">
                        13 al 17 de Noviembre
                    </span>
                </a>

                {/* Botones de navegacion : Comercios/Consumidores*/}
                <nav aria-label="Navegación principal" className="order-3 flex w-full gap-2 sm:order-2 sm:ml-auto sm:w-auto lg:gap-4">
                    <a href="/jobs" className="flex-1 rounded-lg bg-[var(--bottoms-background-color)] px-3 py-2 text-center text-sm font-semibold hover:opacity-90 focus-visible:outline-2 sm:flex-none lg:px-5 lg:text-base">
                        Empleos
                    </a>
                    <a href="/consumidores" className="flex-1 rounded-lg bg-[var(--bottoms-background-color)] px-3 py-2 text-center text-sm font-semibold hover:opacity-90 focus-visible:outline-2 sm:flex-none lg:px-5 lg:text-base">
                        Consumidores
                    </a>
                    <a href="/comercios" className="flex-1 rounded-lg bg-[var(--bottoms-background-color)] px-3 py-2 text-center text-sm font-semibold hover:opacity-90 focus-visible:outline-2 sm:flex-none lg:px-5 lg:text-base">
                        Comercios
                    </a>
                </nav>
                <div className="order-2 ml-auto flex shrink-0 items-center gap-3 sm:order-3 sm:ml-0">
                    {/*Theme*/}
                    <div className="flex items-center gap-3">
                        <SunMedium size={38} />
                        <ThemeToggle/>
                        <SunMoon size={38} />
                    </div>

                    {/* Profile*/}
                    {/* Cuando se inici la sesión cambia las opciones que tienes disponibles para navegar */}
                    {usuario ? (
                        <details className="relative">
                            <summary aria-label="Opciones de mi perfil" className="cursor-pointer list-none rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 [&::-webkit-details-marker]:hidden">
                                <CircleUser size={32}/>
                            </summary>
                            <div className="absolute right-0 top-full mt-3 flex w-56 flex-col overflow-hidden rounded-lg border border-[var(--contrast-color)] bg-[var(--bottoms-background-color)] text-center shadow-lg">
                                <a href={usuario.role === "admin" ? "/admin" : "/empresas"} className="px-5 py-4 font-bold hover:opacity-80 focus-visible:outline-2">
                                    {usuario.role === "admin" ? "Panel de administración" : "Mis empresas"}
                                </a>

                                <button type="button" onClick={()=> setMisDatosAbierto(true)} className="bg-[var(--contrast-color)] px-5 py-4 font-bold hover:opacity-80 focus-visible:outline-2">
                                    Mis datos
                                </button>

                                <button type="button" onClick={cerrarSesion} disabled={cerrandoSesion} className="px-5 py-4 font-bold hover:opacity-80 focus-visible:outline-2 disabled:opacity-60">
                                    {cerrandoSesion ? "Cerrando sesión…" : "Cerrar sesión"}
                                </button>
                            </div>
                        </details>
                        ) : (
                        <button type="button" onClick={() => setLoginAbierto(true)} disabled={verificandoSesion} aria-label={ verificandoSesion ? "Verificando sesión…" : "Iniciar sesión" } className="cursor-pointer rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4">
                            <CircleUser size={32}/>
                        </button>
                    )}
                </div>
            </div>
            <Dialog open={loginAbierto} onOpenChange={setLoginAbierto}>
                {errorSesion && (
                    <p role="alert" className="px-4 pb-3 text-sm">
                        {errorSesion}
                    </p>
                )} {/* if there is an error, it will be displayed in a paragraph with a role of alert */}
                <DialogContent className="max-h-[90dvh] w-[calc(100vw-2rem)] overflow-y-auto p-0 sm:max-w-xl">
                    <DialogTitle className="sr-only">
                        Iniciar sesión
                    </DialogTitle>
                    <Login />
                </DialogContent>
            </Dialog>

            <Dialog open= {misDatosAbierto} onOpenChange={setMisDatosAbierto}>
                <DialogContent className="max-h-[90dvh] w-[calc(100vw-2rem)] overflow-y-auto p-0 sm:max-w-3xl">
                    <DialogTitle className="sr-only">
                        Mis datos personales
                    </DialogTitle>
                    <DatosCuenta/>
                </DialogContent>
            </Dialog>

        </header>
    );
}