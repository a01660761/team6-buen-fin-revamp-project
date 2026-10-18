// Issue #19 (US-03.2): Buscador de comercios participantes (listado).
// Basado en el prototipo de Figma "Buscador de comercios participantes".

import { useState } from "react"; // Hook de React para guardar lo que el usuario escribe en los filtros
import type { FormEvent } from "react"; // NUEVO: tipo de TypeScript para el evento del formulario ("import type" no existía en el código del equipo)
import { List, useListContext, useTranslate } from "react-admin"; // Patrón del equipo: List, useListContext y useTranslate de React-Admin
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

// PENDIENTE (fuera de este PR):
// - Vista pública de detalle del comercio (resto de US-03.2): aún sin diseño.
// - Encabezado y pie del sitio (issue #1): la pantalla se ve dentro del layout de React-Admin.
// - mock/db.json (json-server) es solo para pruebas locales; no son comercios reales ni oficiales.