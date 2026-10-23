import buenFinLogo from '@/assets/top_bar/logo.png';
import facebook from '@/assets/secretaria/facebook.png';
import twitter from '@/assets/secretaria/twitter.png';
import economiaLogo from '@/assets/secretaria/gobierno_economia.png';
import hecho from '@/assets/secretaria/mexico.png';
import { Avisos } from '@/components/layout/avisos'
import { Registro } from '../auth/Registro';
import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

/*

ChatGPT-6 Luna se utilizo para lo siguiente:
- Se utlizo para corregir los errores de sintaxis (typos)
*/

export function Footer(){
    const [registroAbierto, setRegistroAbierto] = useState(false);
    return(
        <footer className='w-full text-[var(--default-text-color)]'>
            <div className="bg-[var(--topbar-background-color)] px-5 py-10 sm:px-8">
                <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Logo */}
                    <div>
                        <img src={buenFinLogo} alt='El Buen Fin' className='h-36 w-auto object-contain'/>
                    </div>

                    {/* Comercios */}
                    <div className='flex flex-col gap-1.5'>
                        <h3 className='text-xl font-extrabold'>Comercios</h3>
                        <button type="button" onClick={() => setRegistroAbierto(true)} className='cursor-pointer text-left hover:underline focus-visible:outline-2 foucs-visible:outline-offset-4'>
                            Registrar 
                        </button>
                        <a href='https://www.sat.gob.mx/minisitio/SorteoElBuenFin/index.html' className='hover:underline'>Sorteo El Buen Fin</a>
                        <a href='https://mipymes.economia.gob.mx' className='hover:underline'>Haz crecer tu negocio</a>
                    </div>

                    {/* Consumidores */}
                    <div className='flex flex-col gap-1.5'>
                        <h3 className='text-xl font-extrabold'>Consumidores</h3>
                        <a href='https://www.elbuenfin.org/assets/documents/E_Infografico_Derechos_del_Consumidor.png' className='hover:underline'>Conoce tus derechos</a>
                        <a href='/compra-segura' className='hover:underline' >Aprende a comprar seguro</a>
                        <a href='/fraudes' className='hover:underline' >Tips para prevenir fraudes</a>
                    </div>

                    {/* Buen Fin */}
                    <div className='flex flex-col gap-1.5'>
                        <h3 className='text-xl font-extrabold'>Buen Fin</h3>
                        <Avisos tipo='privacidad'/>
                        <Avisos tipo='terminos'/>
                        <a href='https://www.elbuenfin.org/assets/documents/REGLAS_DE_OPERACION_BUEN_FIN.pdf' className='hover:underline'>Reglas de Operación</a>
                        <a href='https://www.elbuenfin.org/assets/documents/ANEXO_2_DERECHOS_Y_OBLIGACIONES_2026.pdf ' className='hover:underline'>Anexo 2. Derechos y obligaciones</a>
                        <a href='/preguntas-frecuentes' className='hover:underline'>Preguntas frecuentes</a>
                    </div>
                </div>

                {/* Redes sociales */}
                <div className='mx-auto mt-10 flex max-w-7xl flex-wrap items-center justify-center gap-10 font-semibold'>
                    <div className='flex items-center gap-4'>
                        <span>Síguemos</span>
                        <a href='https://x.com/ElBuenFin'>
                            <img src={twitter} alt='Twitter' className='h-7 w-7 object-contain'/>
                        </a>
                        <a href='https://www.facebook.com/ElBuenFin/'>
                            <img src={facebook} alt='Faebook' className='h-7 w-7 object-contain'/>
                        </a>
                    </div>
                    <a href="mailto:contacto@elbuenfin.org">contacto@elbuenfin.org</a>
                </div>
            </div>

            {/* Franja institucional */}
            <div className="bg-[var(--baner-background-color)] px-8 py-8">
                <div className='mx-auto grid max-w-7xl grid-cols-1 items-center gap-6 lg:grid-cols-[1fr_auto_1fr]'>
                    
                    <div className='hidden lg:block'/>
                    <div className='className="flex flex-wrap items-center justify-center gap-4 sm:gap-6"'>
                        <img src={economiaLogo} alt='Secretaría de Economía' className='h-30 w-auto object-contain'/>

                        <div className='h-16 border-l-2 border-white'/>
                        <img src={hecho} alt='Hecho en México' className='h-20 w-auto object-contain'/>
                    </div>

                    <p className='text-right text-xs'>D.R. © 2026 Secretaría de Economía.
                        <span className='block'>Todos los derechos reservados.</span>
                    </p>
                </div>
            </div>
            <Dialog open={registroAbierto} onOpenChange={setRegistroAbierto}>
                <DialogContent className="max-h-[90dvh] w-[calc(100vw-2rem)] overflow-y-auto p-4 sm:max-w-2xl sm:p-6 bg-[var(--card-background-2)]">
                    <DialogTitle className="sr-only">
                        Registro de usuario
                    </DialogTitle>
                    <Registro />
                </DialogContent>
            </Dialog>
        </footer>
    );
}