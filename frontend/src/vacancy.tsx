// Issue #43 (US-11.1): listado público de vacantes, filtro por tipo y detalle (provisional).
// Sigue la estructura de business.tsx y offer.tsx. Cada bloque indica si sigue el patrón
// del equipo (React-Admin) o si es una adición nueva.

import { useState } from "react"; // Hook de React para guardar lo que el usuario escribe en los filtros
import type { FormEvent } from "react"; // Tipo de TypeScript para el evento del formulario
import {
    Link, List, Pagination as ListPagination, Show,
    useCreatePath, useGetOne, useListContext, useRecordContext, useTranslate
} from "react-admin"; // Patrón del equipo: List, Show y hooks de React-Admin. ListPagination es la paginación de React-Admin (se renombra para no confundirla con la de MUI)
import type { RaRecord } from "react-admin"; // Tipo base de un registro de React-Admin
import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    MenuItem,
    TextField,
    ThemeProvider,
    Typography,
    createTheme,
} from "@mui/material"; // Componentes de MUI (la librería de diseño del proyecto)

// NUEVO: mismos colores que business.tsx (se repiten aquí para no tocar ese archivo).
const COLORS = {
    red: "#961f14", // Rojo del precio y del botón al pasar el cursor
    darkRed: "#751d17", // Rojo oscuro de los botones
    pageBackground: "#f5ece6", // Fondo de la pantalla
    searchBand: "#e5dad3", // Fondo de la barra de búsqueda
};

// NUEVO: tema claro solo para esta pantalla, igual que en business.tsx.
const lightTheme = createTheme({ palette: { mode: "light" } });

// Forma de una vacante. Los campos coinciden con mock/db.json y con el backend (vacancies.js).
interface Vacancy extends RaRecord {
    companyId: number; // Id del comercio que publica la vacante
    position: string; // Nombre del puesto
    type: "temporary" | "permanent"; // Temporal o permanente
    description: string; // Descripción breve
    location: string; // Ubicación en texto (no hay mapas ni geolocalización)
    applicationUrl?: string; // Enlace externo para aplicar; puede faltar
}

// Forma mínima de un comercio: solo se usa el nombre.
interface Business extends RaRecord {
    name: string;
}

// Muestra el nombre del comercio dueño de la vacante. Lo pide aparte con el companyId.
const VacancyCompany = ({ companyId }: { companyId: number }) => {
    const translate = useTranslate();
    const { data: business, isPending } = useGetOne<Business>("businesses", { id: companyId }); // Mismo recurso que el directorio
    return (
        <Typography variant="body2" color="text.secondary">
            {translate("directory.vacancy_company")}:{" "}
            {isPending ? <CircularProgress size={12} /> : business?.name}
        </Typography>
    );
};

// Barra de búsqueda: texto y tipo de vacante.
const VacancySearchBar = () => {
    const translate = useTranslate();
    const { filterValues, setFilters } = useListContext(); // Patrón de React-Admin: leer y cambiar los filtros de la lista
    const [name, setName] = useState<string>(filterValues.q ?? ""); // Texto de búsqueda; "q" es el filtro de texto libre
    const [type, setType] = useState<string>(filterValues.type ?? "all"); // "all", "temporary" o "permanent"

    // Los filtros se aplican al pulsar "Buscar", igual que en el directorio.
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Evita que el formulario recargue la página
        const filters: Record<string, string> = {};
        if (name.trim() !== "") {
            filters.q = name.trim(); // Solo se manda el texto si no está vacío
        }
        if (type !== "all") {
            filters.type = type;
        }
        setFilters(filters, {}); // Aplica los filtros y vuelve a la página 1
    };

    return (
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
                label={translate("directory.search_vacancy")} // "Buscar vacante"
                value={name}
                onChange={(event) => setName(event.target.value)}
                sx={{ backgroundColor: "#ffffff" }}
            />
            <TextField
                select // Lo convierte en lista desplegable
                size="small"
                label={translate("directory.vacancy_type")} // "Tipo de vacante"
                value={type}
                onChange={(event) => setType(event.target.value)}
                sx={{ minWidth: 200, backgroundColor: "#ffffff" }}
            >
                <MenuItem value="all">{translate("directory.all")}</MenuItem>
                <MenuItem value="temporary">{translate("directory.vacancy_temporary")}</MenuItem>
                <MenuItem value="permanent">{translate("directory.vacancy_permanent")}</MenuItem>
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
    );
};

// Cuadrícula de vacantes (1 columna en celular, 2 en pantalla grande).
const VacancyGrid = () => {
    const translate = useTranslate();
    const createPath = useCreatePath(); // Arma rutas con el prefijo /directorio
    const { data, isPending, error } = useListContext<Vacancy>(); // Datos que React-Admin ya trajo del dataProvider

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
        return <Alert severity="error">{translate("directory.vacancy_error")}</Alert>;
    }

    // Estado vacío: la búsqueda no encontró vacantes
    if (!data || data.length === 0) {
        return <Alert severity="info">{translate("directory.vacancy_empty")}</Alert>;
    }

    return (
        <Box
            sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: {
                    xs: "repeat(1, 1fr)", // 1 columna en celular
                    md: "repeat(2, 1fr)", // 2 columnas en pantalla grande
                },
            }}
        >
            {data.map((vacancy) => (
                <Box
                    key={vacancy.id}
                    component="article" // Cada vacante es un <article> (mejor accesibilidad)
                    sx={{ backgroundColor: "#ffffff", borderRadius: 1, p: 2 }}
                >
                    <Typography variant="subtitle1" fontWeight="bold">
                        {/* El título lleva al detalle de la vacante */}
                        <Link to={createPath({ resource: "vacancies", id: vacancy.id, type: "show" })}>
                            {vacancy.position}
                        </Link>
                    </Typography>
                    <VacancyCompany companyId={vacancy.companyId} />
                    <Box sx={{ display: "flex", gap: 1, my: 1 }}>
                        <Chip
                            size="small"
                            label={translate(
                                vacancy.type === "temporary"
                                    ? "directory.vacancy_temporary"
                                    : "directory.vacancy_permanent",
                            )}
                        />
                        <Chip size="small" variant="outlined" label={vacancy.location} />
                    </Box>
                    <Typography variant="body2">{vacancy.description}</Typography>
                </Box>
            ))}
        </Box>
    );
};

// Pantalla principal. Se registra en App.tsx con <Resource name="vacancies" list={VacancyList} />.
export const VacancyList = () => {
    const translate = useTranslate();
    return (
        <List
            title={false} // Sin el título automático de React-Admin
            actions={false} // Sin botones de crear/exportar: es una pantalla pública
            pagination={false} // Se desactiva la paginación automática; se pone abajo, dentro del tema claro
            empty={false} // Sin la pantalla vacía de React-Admin (se muestra nuestro mensaje)
            perPage={8} // 8 vacantes por página
            sort={{ field: "position", order: "ASC" }} // Orden alfabético por puesto
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
                    <Typography variant="h4" component="h1" align="center" sx={{ mb: 3 }}>
                        {translate("directory.vacancies_title")} {/* "Vacantes de empleo" */}
                    </Typography>
                    <Alert severity="info" sx={{ mb: 3 }}>
                        {translate("directory.demo_notice")} {/* Aviso: los datos son de demostración */}
                    </Alert>
                    <VacancySearchBar />
                    <VacancyGrid />
                    <ListPagination rowsPerPageOptions={[]} /> {/* Paginación de React-Admin, sin selector de filas */}
                </Box>
            </ThemeProvider>
        </List>
    );
};

// Contenido del detalle. Va dentro de <Show>, que ya trajo la vacante y la deja en el contexto.
const VacancyDetail = () => {
    const translate = useTranslate();
    const createPath = useCreatePath();
    const vacancy = useRecordContext<Vacancy>(); // Vacante que se está viendo

    // Mientras llega la vacante no se muestra nada (Show ya muestra su propio estado de carga)
    if (!vacancy) {
        return null;
    }

    return (
        <Box sx={{ p: 2 }}>
            {/* Volver al listado de vacantes */}
            <Link to={createPath({ resource: "vacancies", type: "list" })}>
                {translate("directory.vacancy_back")} {/* "Volver a las vacantes" */}
            </Link>

            <Typography variant="h4" component="h1" sx={{ mt: 2, mb: 1 }}>
                {vacancy.position}
            </Typography>

            <Box sx={{ mb: 2 }}>
                <VacancyCompany companyId={vacancy.companyId} />
            </Box>

            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                <Chip
                    label={translate(
                        vacancy.type === "temporary"
                            ? "directory.vacancy_temporary"
                            : "directory.vacancy_permanent",
                    )}
                />
            </Box>

            <Typography variant="body1" sx={{ mb: 2 }}>
                {vacancy.description}
            </Typography>

            <Typography variant="body2" sx={{ mb: 3 }}>
                <strong>{translate("directory.vacancy_location")}:</strong> {vacancy.location}
            </Typography>

            {/* Enlace para aplicar: si existe se muestra como externo; si falta, se avisa sin romper la pantalla */}
            {vacancy.applicationUrl ? (
                <Box>
                    <Alert severity="info" sx={{ mb: 2 }}>
                        {translate("directory.vacancy_external_notice")} {/* Abre otra pestaña; no se pide CV aquí */}
                    </Alert>
                    <Button
                        href={vacancy.applicationUrl}
                        target="_blank" // Se abre en otra pestaña
                        rel="noopener noreferrer" // Seguridad: la pestaña nueva no puede controlar esta
                        variant="contained"
                        sx={{
                            backgroundColor: COLORS.darkRed,
                            "&:hover": { backgroundColor: COLORS.red },
                        }}
                    >
                        {translate("directory.vacancy_apply")} {/* "Aplicar en el sitio del comercio" */}
                    </Button>
                </Box>
            ) : (
                <Alert severity="warning">
                    {translate("directory.vacancy_no_link")} {/* "El comercio aún no proporcionó un enlace" */}
                </Alert>
            )}
        </Box>
    );
};

// Pantalla de detalle. Se registra en App.tsx con <Resource name="vacancies" show={VacancyShow} />.
export const VacancyShow = () => (
    <ThemeProvider theme={lightTheme}>
        <Box sx={{ p: 3, backgroundColor: COLORS.pageBackground, color: "text.primary" }}>
            {/* disableAuthentication: el detalle es público, igual que el listado */}
            <Show title={false} actions={false} disableAuthentication>
                <VacancyDetail />
            </Show>
        </Box>
    </ThemeProvider>
);

// PENDIENTE (fuera de este PR):
// - El diseño final del listado y del detalle (el actual es provisional).
// - Probado solo con mock/db.json (json-server); falta probar con el backend real.