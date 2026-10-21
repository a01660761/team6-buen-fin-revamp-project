// Issue #19 (US-03.2): Buscador de comercios participantes (listado) y detalle público (provisional).
// Issue #34 (US-08.2): catálogo de productos y ofertas dentro del detalle del comercio (provisional).
// Basado en el prototipo de Figma "Buscador de comercios participantes".
// Cada bloque indica si sigue el patrón del equipo (React-Admin) o si es una adición nueva.

import { useState } from "react"; // Hook de React para guardar lo que el usuario escribe en los filtros
import type { FormEvent } from "react"; // NUEVO: tipo de TypeScript para el evento del formulario ("import type" no existía en el código del equipo)
import {
    BooleanField, EmailField, Link, List, Show, SimpleShowLayout,
    TextField as FieldText, UrlField, useCreatePath, useGetList, useListContext,
    useRecordContext, useTranslate
} from "react-admin"; // Patrón del equipo: componentes de React-Admin (List, Show, campos) y useGetList (como en Dashboard.tsx). FieldText es el TextField de React-Admin; se renombra porque TextField de MUI ya se usa en los filtros
import type { RaRecord } from "react-admin"; // Tipo base de un registro de React-Admin
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    MenuItem,
    Pagination,
    TextField,
    ThemeProvider,
    Typography,
    createTheme,
} from "@mui/material"; // Componentes de MUI (la librería de diseño del proyecto)

// NUEVO: colores tomados de una captura del Figma (no se vio el Figma directamente).
const COLORS = {
    red: "#961f14", // Rojo del encabezado/pie y de la página seleccionada
    darkRed: "#751d17", // Rojo oscuro del botón "Buscar"
    pageBackground: "#f5ece6", // Fondo de la pantalla
    searchBand: "#e5dad3", // Fondo de la barra de búsqueda
};

// NUEVO: tema claro solo para esta pantalla. El Figma es claro y la app puede estar
// en modo oscuro, lo que dejaba los textos invisibles sobre los fondos claros.
const lightTheme = createTheme({ palette: { mode: "light" } });

// Forma de un comercio. Los campos coinciden con mock/db.json y con spanishIndex.ts (resources.businesses).
interface Business extends RaRecord {
    name: string; // Nombre del comercio
    category: string; // Categoría (Alimentos, Moda, etc.)
    physicalStore: boolean; // true si tiene tienda física
}

// NUEVO (issue #34): forma de un producto y de una oferta (docs/data-model.md, secciones 5 y 6).
interface Product extends RaRecord {
    name: string; // Nombre del producto
    description: string; // Descripción del producto
    category: string; // Categoría del producto
    priceCents: number; // Precio en centavos (129900 = $1,299.00)
    currency: string; // Moneda; solo MXN por ahora
}

interface Offer extends RaRecord {
    title: string; // Título de la oferta
    description: string; // Descripción de la oferta
    priceCents: number; // Precio de la oferta en centavos
    currency: string; // Moneda; solo MXN por ahora
    endsAt: string; // Fecha de fin de la oferta (ISO 8601)
    terms: string; // Términos y condiciones
    sellerUrl: string; // Enlace externo al vendedor
}

// NUEVO (issue #34): convierte centavos a pesos con formato de moneda. Ej.: 129900 -> "$1,299.00"
const formatPrice = (priceCents: number, currency: string): string =>
    (priceCents / 100).toLocaleString("es-MX", { style: "currency", currency });

// NUEVO: categorías escritas a mano. Cuando exista el backend deberían venir de los datos.
const CATEGORIES = ["Alimentos", "Moda", "Electrónica", "Hogar", "Servicios", "Salud"];

// NUEVO: muestra las iniciales del comercio en lugar de un logo (aún no hay imágenes).
const getInitials = (name: string): string =>
    name
        .split(" ") // Separa el nombre en palabras
        .filter((word) => word.length > 0) // Ignora espacios dobles
        .slice(0, 2) // Toma solo las dos primeras palabras
        .map((word) => word[0].toUpperCase()) // Primera letra en mayúscula
        .join(""); // Une las letras: "Boutique Aurora Demo" -> "BA"

// Barra de búsqueda: texto, tienda física y categoría (los 3 campos del Figma).
const BusinessSearchBar = () => {
    const translate = useTranslate(); // Patrón del equipo: textos traducidos desde spanishIndex.ts
    const { filterValues, setFilters } = useListContext(); // Patrón de React-Admin: leer y cambiar los filtros de la lista
    const [name, setName] = useState<string>(filterValues.q ?? ""); // Texto de búsqueda; "q" es el filtro de texto libre de json-server
    const [physicalStore, setPhysicalStore] = useState<string>(
        filterValues.physicalStore === undefined
            ? "all"
            : String(filterValues.physicalStore),
    ); // "all", "true" o "false" (el Select de MUI trabaja con texto)
    const [category, setCategory] = useState<string>(filterValues.category ?? "all"); // "all" o el nombre de la categoría

    // Los filtros se aplican al pulsar "Buscar", como en el prototipo.
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Evita que el formulario recargue la página
        const filters: Record<string, string | boolean> = {};
        if (name.trim() !== "") {
            filters.q = name.trim(); // Solo se manda el texto si no está vacío
        }
        if (physicalStore !== "all") {
            filters.physicalStore = physicalStore === "true"; // Se convierte el texto a booleano
        }
        if (category !== "all") {
            filters.category = category;
        }
        setFilters(filters, {}); // Aplica los filtros y React-Admin vuelve a pedir los datos (regresa a la página 1)
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" }, // En celular los campos van en columna, en pantalla grande en fila
                gap: 2,
                p: 2,
                mb: 3,
                backgroundColor: COLORS.searchBand,
            }}
        >
            <TextField
                size="small"
                fullWidth
                label={translate("directory.search_business")} // "Buscar comercio"
                value={name}
                onChange={(event) => setName(event.target.value)}
                sx={{ backgroundColor: "#ffffff" }}
            />
            <TextField
                select // Lo convierte en lista desplegable
                size="small"
                label={translate("directory.physical_store")} // "Tienda física"
                value={physicalStore}
                onChange={(event) => setPhysicalStore(event.target.value)}
                sx={{ minWidth: 180, backgroundColor: "#ffffff" }}
            >
                <MenuItem value="all">{translate("directory.all")}</MenuItem>
                <MenuItem value="true">{translate("directory.yes")}</MenuItem>
                <MenuItem value="false">{translate("directory.no")}</MenuItem>
            </TextField>
            <TextField
                select
                size="small"
                label={translate("directory.category")} // "Categoría"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                sx={{ minWidth: 180, backgroundColor: "#ffffff" }}
            >
                <MenuItem value="all">{translate("directory.all")}</MenuItem>
                {CATEGORIES.map((item) => (
                    <MenuItem key={item} value={item}>
                        {item}
                    </MenuItem>
                ))}
            </TextField>
            <Button
                type="submit" // Al pulsarlo se ejecuta handleSubmit
                variant="contained"
                sx={{
                    backgroundColor: COLORS.darkRed,
                    "&:hover": { backgroundColor: COLORS.red },
                }}
            >
                {translate("directory.search")} {/* "Buscar" */}
            </Button>
        </Box>
    );
};

// Cuadrícula de comercios (4 columnas en pantalla grande, 2 en celular).
const BusinessGrid = () => {
    const translate = useTranslate();
    const createPath = useCreatePath(); // NUEVO: arma rutas con el prefijo /directorio
    const { data, isPending, error } = useListContext<Business>(); // Datos que React-Admin ya trajo del dataProvider

    // Estado de carga: mientras llegan los datos
    if (isPending) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                <CircularProgress aria-label={translate("directory.loading")} />
            </Box>
        );
    }

    // Estado de error: por ejemplo, si el servidor está apagado
    if (error) {
        return <Alert severity="error">{translate("directory.error")}</Alert>;
    }

    // Estado vacío: la búsqueda no encontró comercios
    if (!data || data.length === 0) {
        return <Alert severity="info">{translate("directory.empty")}</Alert>;
    }

    return (
        <Box
            sx={{
                display: "grid",
                gap: 3,
                gridTemplateColumns: {
                    xs: "repeat(2, 1fr)", // 2 columnas en celular
                    md: "repeat(4, 1fr)", // 4 columnas en pantalla grande, como el Figma
                },
            }}
        >
            {data.map((business) => (
                <Box
                    key={business.id}
                    component="article" // Cada comercio es un <article> (mejor accesibilidad)
                    sx={{ textAlign: "center" }}
                >
                    {/* NUEVO: toda la tarjeta es un enlace al detalle público (/businesses/:id/show) */}
                    <Link
                        to={createPath({ resource: "businesses", id: business.id, type: "show" })}
                        style={{ textDecoration: "none", color: "inherit" }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                height: 120,
                                backgroundColor: "#ffffff", // Recuadro blanco donde iría el logo
                                borderRadius: 1,
                            }}
                        >
                            <Typography
                                variant="h4"
                                color="text.secondary"
                                aria-hidden="true" // Decorativo: el nombre ya se lee debajo
                            >
                                {getInitials(business.name)}
                            </Typography>
                        </Box>
                        <Typography variant="body2" fontWeight="bold" sx={{ mt: 1 }}>
                            {business.name}
                        </Typography>
                    </Link>
                </Box>
            ))}
        </Box>
    );
};

// NUEVO: paginación con botones de página y campo "Ir a la página", como el Figma.
// No se copió de otra pantalla del repo; usa el componente Pagination de MUI.
const BusinessPagination = () => {
    const translate = useTranslate();
    const { page, perPage, total, setPage } = useListContext(); // Página actual, tamaño de página, total de registros y cambiar página
    const [goToPage, setGoToPage] = useState<string>(""); // Número escrito en "Ir a la página"

    // Sin resultados no se muestra la paginación
    if (!total) {
        return null;
    }

    const pageCount = Math.ceil(total / perPage); // Ej.: 20 comercios / 8 por página = 3 páginas

    // Salta a la página escrita solo si es un entero válido entre 1 y la última página
    const handleGo = () => {
        const value = Number(goToPage);
        if (Number.isInteger(value) && value >= 1 && value <= pageCount) {
            setPage(value);
        }
        setGoToPage(""); // Limpia el campo
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                mt: 4,
            }}
        >
            <Pagination
                count={pageCount}
                page={page}
                onChange={(_event, value) => setPage(value)} // Al pulsar un número, React-Admin pide esa página
                showFirstButton // Botón "primera página"
                showLastButton // Botón "última página"
                sx={{
                    "& .MuiPaginationItem-root.Mui-selected": {
                        backgroundColor: COLORS.red, // Página actual en rojo, como el Figma
                        color: "#ffffff",
                    },
                }}
            />
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2">{translate("directory.page")}</Typography> {/* "Página" */}
                <TextField
                    size="small"
                    type="number"
                    label={translate("directory.go_to_page")} // "Ir a la página"
                    value={goToPage}
                    onChange={(event) => setGoToPage(event.target.value)}
                    sx={{ width: 140 }}
                />
                <Button
                    variant="contained"
                    onClick={handleGo}
                    sx={{
                        backgroundColor: COLORS.darkRed,
                        "&:hover": { backgroundColor: COLORS.red },
                    }}
                >
                    {translate("directory.go")} {/* "Ir" */}
                </Button>
            </Box>
        </Box>
    );
};

// Pantalla principal. Se registra en App.tsx con <Resource name="businesses" list={BusinessList} />.
export const BusinessList = () => {
    const translate = useTranslate();
    return (
        <List
            title={false} // Sin el título automático de React-Admin (se usa el del Figma)
            actions={false} // Sin botones de crear/exportar: es un directorio público
            pagination={false} // Se desactiva la paginación de React-Admin porque se usa BusinessPagination
            empty={false} // Sin la pantalla vacía de React-Admin (se muestra nuestro mensaje)
            perPage={8} // 8 comercios por página (2 filas de 4)
            disableAuthentication // Patrón del equipo: pantalla pública, sin iniciar sesión
        >
            <ThemeProvider theme={lightTheme}>
                <Box
                    sx={{
                        p: 3,
                        backgroundColor: COLORS.pageBackground,
                        color: "text.primary",
                    }}
                >
                    <Typography
                        variant="h4"
                        component="h1"
                        align="center"
                        sx={{ mb: 3 }}
                    >
                        {translate("directory.title")} {/* "Buscador de comercios participantes" */}
                    </Typography>
                    <Alert severity="info" sx={{ mb: 3 }}>
                        {translate("directory.demo_notice")} {/* Aviso: los datos son de demostración */}
                    </Alert>
                    <BusinessSearchBar />
                    <BusinessGrid />
                    <BusinessPagination />
                </Box>
            </ThemeProvider>
        </List>
    );
};

// NUEVO (issue #34, PROVISIONAL): catálogo de productos y ofertas de un comercio.
// Va dentro del detalle del comercio. Busca con "q" y filtra productos por categoría,
// leyendo /public/products y /public/offers (docs/api-contract.md) con useGetList.
const BusinessCatalog = () => {
    const translate = useTranslate();
    const record = useRecordContext<Business>(); // Comercio que se está viendo
    const [name, setName] = useState<string>(""); // Texto escrito en el buscador
    const [category, setCategory] = useState<string>("all"); // "all" o el nombre de la categoría
    const [filters, setFilters] = useState<Record<string, string>>({}); // Filtros aplicados al pulsar "Buscar"

    // Los filtros se aplican al pulsar "Buscar", igual que en el listado de comercios.
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Evita que el formulario recargue la página
        const newFilters: Record<string, string> = {};
        if (name.trim() !== "") {
            newFilters.q = name.trim(); // Solo se manda el texto si no está vacío
        }
        if (category !== "all") {
            newFilters.category = category;
        }
        setFilters(newFilters);
    };

    // Productos del comercio, con búsqueda y categoría. 50 por página por ahora (el máximo de la API es 100).
    const products = useGetList<Product>(
        "catalogProducts",
        {
            pagination: { page: 1, perPage: 50 },
            sort: { field: "name", order: "ASC" },
            filter: { companyId: record?.id, ...filters },
        },
        { enabled: !!record },
    );

    // Ofertas del comercio. Solo usan la búsqueda de texto: las ofertas no tienen categoría.
    const offers = useGetList<Offer>(
        "catalogOffers",
        {
            pagination: { page: 1, perPage: 50 },
            sort: { field: "endsAt", order: "ASC" },
            filter: { companyId: record?.id, ...(filters.q ? { q: filters.q } : {}) },
        },
        { enabled: !!record },
    );

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
                {translate("directory.catalog_title")} {/* "Catálogo del comercio" */}
            </Typography>

            {/* Barra de búsqueda del catálogo: texto y categoría */}
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" }, // En celular en columna, en pantalla grande en fila
                    gap: 2,
                    p: 2,
                    mb: 3,
                    backgroundColor: COLORS.searchBand,
                }}
            >
                <TextField
                    size="small"
                    fullWidth
                    label={translate("directory.search_catalog")} // "Buscar producto u oferta"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    sx={{ backgroundColor: "#ffffff" }}
                />
                <TextField
                    select
                    size="small"
                    label={translate("directory.category")} // "Categoría"
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    sx={{ minWidth: 180, backgroundColor: "#ffffff" }}
                >
                    <MenuItem value="all">{translate("directory.all")}</MenuItem>
                    {CATEGORIES.map((item) => (
                        <MenuItem key={item} value={item}>
                            {item}
                        </MenuItem>
                    ))}
                </TextField>
                <Button
                    type="submit"
                    variant="contained"
                    sx={{
                        backgroundColor: COLORS.darkRed,
                        "&:hover": { backgroundColor: COLORS.red },
                    }}
                >
                    {translate("directory.search")} {/* "Buscar" */}
                </Button>
            </Box>

            {/* Productos: estados de carga, error y vacío, y cuadrícula de resultados */}
            <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
                {translate("directory.products_title")} {/* "Productos" */}
            </Typography>
            {products.isPending ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                    <CircularProgress aria-label={translate("directory.loading")} />
                </Box>
            ) : products.error ? (
                <Alert severity="error">{translate("directory.catalog_error")}</Alert>
            ) : !products.data || products.data.length === 0 ? (
                <Alert severity="info">{translate("directory.catalog_empty")}</Alert>
            ) : (
                <Box
                    sx={{
                        display: "grid",
                        gap: 2,
                        gridTemplateColumns: {
                            xs: "repeat(1, 1fr)", // 1 columna en celular
                            sm: "repeat(2, 1fr)", // 2 columnas en pantalla mediana
                            md: "repeat(3, 1fr)", // 3 columnas en pantalla grande
                        },
                    }}
                >
                    {products.data.map((product) => (
                        <Box
                            key={product.id}
                            component="article"
                            sx={{ backgroundColor: "#ffffff", borderRadius: 1, p: 2 }}
                        >
                            <Typography variant="subtitle1" fontWeight="bold">
                                {product.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {product.category}
                            </Typography>
                            <Typography variant="body2" sx={{ my: 1 }}>
                                {product.description}
                            </Typography>
                            <Typography variant="h6" sx={{ color: COLORS.red }}>
                                {formatPrice(product.priceCents, product.currency)}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            )}

            {/* Ofertas: mismos estados que los productos */}
            <Typography variant="h6" component="h3" sx={{ mt: 4, mb: 2 }}>
                {translate("directory.offers_title")} {/* "Ofertas" */}
            </Typography>
            {offers.isPending ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                    <CircularProgress aria-label={translate("directory.loading")} />
                </Box>
            ) : offers.error ? (
                <Alert severity="error">{translate("directory.catalog_error")}</Alert>
            ) : !offers.data || offers.data.length === 0 ? (
                <Alert severity="info">{translate("directory.offers_empty")}</Alert>
            ) : (
                <Box
                    sx={{
                        display: "grid",
                        gap: 2,
                        gridTemplateColumns: {
                            xs: "repeat(1, 1fr)",
                            md: "repeat(2, 1fr)",
                        },
                    }}
                >
                    {offers.data.map((offer) => (
                        <Box
                            key={offer.id}
                            component="article"
                            sx={{ backgroundColor: "#ffffff", borderRadius: 1, p: 2 }}
                        >
                            <Typography variant="subtitle1" fontWeight="bold">
                                {offer.title}
                            </Typography>
                            <Typography variant="body2" sx={{ my: 1 }}>
                                {offer.description}
                            </Typography>
                            <Typography variant="h6" sx={{ color: COLORS.red }}>
                                {formatPrice(offer.priceCents, offer.currency)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block">
                                {translate("directory.valid_until")}{" "}
                                {new Date(offer.endsAt).toLocaleDateString("es-MX")}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                                {offer.terms}
                            </Typography>
                            {/* Enlace externo al vendedor; se abre en otra pestaña */}
                            <Button
                                href={offer.sellerUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                variant="contained"
                                size="small"
                                sx={{
                                    backgroundColor: COLORS.darkRed,
                                    "&:hover": { backgroundColor: COLORS.red },
                                }}
                            >
                                {translate("directory.view_offer")} {/* "Ver oferta" */}
                            </Button>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
};

// NUEVO (PROVISIONAL): detalle público de un comercio, con los componentes de React-Admin.
// Aún no hay diseño en Figma; muestra los campos públicos de docs/data-model.md (sección 4).
// Se registra en App.tsx con <Resource name="businesses" list={BusinessList} show={BusinessShow} />.
export const BusinessShow = () => {
    const translate = useTranslate();
    const createPath = useCreatePath(); // NUEVO: arma rutas con el prefijo /directorio
    return (
        <ThemeProvider theme={lightTheme}>
            <Box
                sx={{
                    p: 3,
                    backgroundColor: COLORS.pageBackground,
                    color: "text.primary",
                }}
            >
                <Link to={createPath({ resource: "businesses", type: "list" })}>{translate("directory.back")}</Link> {/* "Volver al buscador" */}
                <Show title={false} actions={false} disableAuthentication>
                    {/* disableAuthentication: el detalle es público, igual que el listado */}
                    <SimpleShowLayout>
                        <FieldText source="name" />
                        <FieldText source="category" />
                        <BooleanField source="physicalStore" />
                        <FieldText source="address" />
                        <FieldText source="description" />
                        <EmailField source="contactEmail" />
                        <FieldText source="contactPhone" />
                        <UrlField source="websiteUrl" />
                    </SimpleShowLayout>
                    <BusinessCatalog /> {/* NUEVO (issue #34): catálogo del comercio */}
                </Show>
            </Box>
        </ThemeProvider>
    );
};

// PENDIENTE (fuera de este PR):
// - El diseño final del detalle público y del catálogo (el actual es provisional).
// - Paginación del catálogo (por ahora se piden hasta 50 productos y 50 ofertas).
// - Encabezado y pie del sitio (issue #1): la pantalla se ve dentro del layout de React-Admin.
// - mock/db.json (json-server) es solo para pruebas locales; no son comercios reales ni oficiales.