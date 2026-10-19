import buenFinLogo from '@/assets/top_bar/logo.png';
import facebook from '@/assets/secretaria/facebook.png';
import twitter from '@/assets/secretaria/twitter.png';
import economiaLogo from '@/assets/secretaria/gobierno_economia.png';
import hecho from '@/assets/secretaria/mexico.png';


export function Footer(){
    return(
        <footer className='w-full text-[var(--default-text-color)]'>
            <div className="bg-[var(--topbar-background-color)] px-8 py-10">
                <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Logo */}
                    <div>
                        <img src={buenFinLogo} alt='El Buen Fin' className='h-36 w-auto object-contain'/>
                    </div>

                    {/* Comercios */}
                    <div className='flex flex-col gap-1.5'>
                        <h3 className='text-xl font-extrabold'>Comercios</h3>
                        <a href=''>Registrar</a>
                        <a href=''>Sorteo El Buen Fin</a>
                        <a href=''>Haz crecer tu negocio</a>
                    </div>

                    {/* Consumidores */}
                    <div className='flex flex-col gap-1.5'>
                        <h3 className='text-xl font-extrabold'>Consumidores</h3>
                        <a href=''>Conoce tus derechos</a>
                        <a href=''>Aprende a comprar seguro</a>
                        <a href=''>Tips para prevenir fraudes</a>
                    </div>

                    {/* Buen Fin */}
                    <div className='flex flex-col gap-1.5'>
                        <h3 className='text-xl font-extrabold'>Buen Fin</h3>
                        <a href=''>Avisos de privacidad</a>
                        <a href=''>Términos y condiciones</a>
                        <a href=''>Anexo 2. Derechos y obligaciones</a>
                        <a href=''>Preguntas frecuentes</a>
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
                            <img src={facebook} alt='Twitter' className='h-7 w-7 object-contain'/>
                        </a>
                    </div>
                    <a href="mailto:contacto@elbuenfin.org">contacto@elbuenfin.org</a>
                </div>
            </div>

            {/* Franja institucional */}
            <div className="bg-[var(--baner-background-color)] px-8 py-8">
                <div className='mx-auto grid max-w-7xl grid-cols-1 items-center gap-6 lg:grid-cols-[1fr_auto_1fr]'>
                    
                    <div className='hidden lg:block'/>
                    <div className='flex items-center justify-center gap-6'>
                        <img src={economiaLogo} alt='Secretaría de Economía' className='h-30 w-auto object-contain'/>

                        <div className='h-16 border-l-2 border-white'/>
                        <img src={hecho} alt='Hecho en México' className='h-20 w-auto object-contain'/>
                    </div>

                    <p className='text-right text-xs'>D.R. © 2026 Secretaría de Economía.
                        <span className='block'>Todos los derechos reservados.</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}