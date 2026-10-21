// Issue #37 (US-09.1): detalle público de una oferta y manejo del enlace externo al vendedor (provisional).
// Cada bloque indica si sigue el patrón del equipo (React-Admin) o si es una adición nueva.

import {
    Link, Show, useCreatePath, useGetOne, useRecordContext, useTranslate
} from "react-admin"; // Patrón del equipo: Show y hooks de React-Admin (useGetOne se usa igual que useGetList en Dashboard.tsx)
import type { RaRecord } from "react-admin"; // Tipo base de un registro de React-Admin
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    ThemeProvider,
    Typography,
    createTheme,
} from "@mui/material"; // Componentes de MUI (la librería de diseño del proyecto)

// NUEVO: mismos colores que business.tsx (se repiten aquí para no tocar ese archivo).
const COLORS = {
    red: "#961f14", // Rojo del precio
    darkRed: "#751d17", // Rojo oscuro del botón
    pageBackground: "#f5ece6", // Fondo de la pantalla
};

// NUEVO: tema claro solo para esta pantalla, igual que en business.tsx.
const lightTheme = createTheme({ palette: { mode: "light" } });

// Forma de una oferta (docs/data-model.md, sección 6).
interface Offer extends RaRecord {
    companyId: number; // Id del comercio dueño de la oferta
    title: string; // Título de la oferta
    description: string; // Descripción de la oferta
    priceCents: number; // Precio de la oferta en centavos
    currency: string; // Moneda; solo MXN por ahora
    startsAt: string; // Fecha de inicio (ISO 8601)
    endsAt: string; // Fecha de fin (ISO 8601)
    terms: string; // Términos y condiciones
    sellerUrl?: string; // Enlace externo al vendedor; puede faltar
}

// Forma mínima de un comercio: solo se usa el nombre.
interface Business extends RaRecord {
    name: string;
}

// Convierte centavos a pesos con formato de moneda. Ej.: 129900 -> "$1,299.00" (igual que en business.tsx)
const formatPrice = (priceCents: number, currency: string): string =>
    (priceCents / 100).toLocaleString("es-MX", { style: "currency", currency });

// NUEVO: convierte una fecha ISO a formato de México. Ej.: "2026-12-31T23:59:59.000Z" -> "31/12/2026"
const formatDate = (isoDate: string): string =>
    new Date(isoDate).toLocaleDateString("es-MX", { timeZone: "UTC" });

// Contenido del detalle. Va dentro de <Show>, que ya trajo la oferta y la deja en el contexto.
const OfferDetail = () => {
    const translate = useTranslate(); // Patrón del equipo: textos traducidos desde spanishIndex.ts
    const createPath = useCreatePath(); // Arma rutas con el prefijo /directorio (igual que en business.tsx)
    const offer = useRecordContext<Offer>(); // Oferta que se está viendo

    // Nombre del comercio: se pide aparte con el companyId de la oferta.
    const { data: business, isPending } = useGetOne<Business>(
        "businesses",
        { id: offer?.companyId },
        { enabled: !!offer }, // No se pide hasta que la oferta ya llegó
    );

    // Mientras llega la oferta no se muestra nada (Show ya muestra su propio estado de carga)
    if (!offer) {
        return null;
    }

    return (
        <Box sx={{ p: 2 }}>
            {/* Volver al comercio: regresa al detalle del comercio dueño de la oferta */}
            <Link to={createPath({ resource: "businesses", id: offer.companyId, type: "show" })}>
                {translate("directory.offer_back")} {/* "Volver al comercio" */}
            </Link>

            <Typography variant="h4" component="h1" sx={{ mt: 2, mb: 1 }}>
                {offer.title}
            </Typography>

            {/* Comercio: carga, o su nombre */}
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
                {translate("directory.offer_company")}:{" "}
                {isPending ? <CircularProgress size={14} /> : business?.name}
            </Typography>

            <Typography variant="body1" sx={{ mb: 2 }}>
                {offer.description}
            </Typography>

            <Typography variant="h5" sx={{ color: COLORS.red, mb: 2 }}>
                {formatPrice(offer.priceCents, offer.currency)}
            </Typography>

            {/* Vigencia: fecha de inicio y de fin */}
            <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>{translate("directory.offer_validity")}:</strong>{" "}
                {formatDate(offer.startsAt)} - {formatDate(offer.endsAt)}
            </Typography>

            {/* Condiciones de la oferta */}
            <Typography variant="body2" sx={{ mb: 3 }}>
                <strong>{translate("directory.offer_terms")}:</strong> {offer.terms}
            </Typography>

            {/* Enlace al vendedor: si existe se muestra claramente como externo; si falta, se avisa sin romper la pantalla */}
            {offer.sellerUrl ? (
                <Box>
                    <Alert severity="info" sx={{ mb: 2 }}>
                        {translate("directory.offer_external_notice")} {/* Aviso: abre el sitio del vendedor en otra pestaña */}
                    </Alert>
                    <Button
                        href={offer.sellerUrl}
                        target="_blank" // Se abre en otra pestaña
                        rel="noopener noreferrer" // Seguridad: la pestaña nueva no puede controlar esta
                        variant="contained"
                        sx={{
                            backgroundColor: COLORS.darkRed,
                            "&:hover": { backgroundColor: COLORS.red },
                        }}
                    >
                        {translate("directory.offer_go_seller")} {/* "Ir al sitio del vendedor" */}
                    </Button>
                </Box>
            ) : (
                <Alert severity="warning">
                    {translate("directory.offer_no_link")} {/* "El vendedor aún no proporcionó un enlace" */}
                </Alert>
            )}
        </Box>
    );
};

// Pantalla principal. Se registra en App.tsx con <Resource name="catalogOffers" show={OfferShow} />.
export const OfferShow = () => (
    <ThemeProvider theme={lightTheme}>
        <Box sx={{ p: 3, backgroundColor: COLORS.pageBackground, color: "text.primary" }}>
            {/* disableAuthentication: el detalle es público, igual que el listado de comercios */}
            <Show title={false} actions={false} disableAuthentication>
                <OfferDetail />
            </Show>
        </Box>
    </ThemeProvider>
);

// PENDIENTE (fuera de este PR):
// - El diseño final del detalle (el actual es provisional).
// - Probado solo con mock/db.json (json-server); falta probar con el backend real.