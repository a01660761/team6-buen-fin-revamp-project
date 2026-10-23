import { Routes, Route } from "react-router-dom";
import { AdminPanel } from "./admin/AdminPanel"; // import the AdminPanel component from the admin folder
import { Admin, Resource } from "react-admin"; // NUEVO
import Landing from "@/pages/Landing";
import Consumidores from "@/pages/Consumidores";
import Comercios from "@/pages/Comercios";
import PreguntasFrecuentes from "./pages/PreguntasFrecuentes";
import CompraSegura from "@/pages/CompraSegura";
import AcercaBuenFin from "@/pages/AcercaBuenFin";
import EmpresasRegistradas from "@/pages/EmpresasRegistradas";
import SucursalesRegistradas from "@/pages/SucuralesRegistradas";
import BuscarEmpresas, { DetalleComercio } from "./pages/BusquedaEmpresa";//import Avisos from "@/pages/Avisos";
import Fraudes from "@/pages/Fraudes";
import { dataProvider } from "./dataProvider"; // NUEVO
import { i18nProvider } from "./i18nProvider"; // NUEVO
import { BusinessList, BusinessShow } from "./business"; // NUEVO
import { OfferShow } from "./offer"; // NUEVO (#37)
import { VacancyList, VacancyShow } from "./vacancy"; // NUEVO (#43)
import StoreIcon from "@mui/icons-material/Store"; // NUEVO
import Jobs, { DetalleVacante } from "./pages/Jobs";
import { DatosCuenta } from "@/components/layout/DatosCuenta";
import DetalleOferta from "./pages/DetalleOferta";
//import Avisos from "@/pages/Avisos";

// NUEVO (issues #19 y #34): directorio público y catálogo de comercios, dentro de React-Admin.
// Se abre en /directorio/businesses. Es pública: no se pasa authProvider.
const Directorio = () => (
  <Admin
    basename="/directorio"
    dataProvider={dataProvider}
    i18nProvider={i18nProvider}
    requireAuth={false}
  >
    <Resource name="businesses" list={BusinessList} show={BusinessShow} icon={StoreIcon} />
    <Resource name="catalogOffers" show={OfferShow} /> {/* NUEVO (#37): detalle de oferta, sin listado ni menú */}
    <Resource name="vacancies" list={VacancyList} show={VacancyShow} /> {/* NUEVO (#43): vacantes públicas, listado y detalle */}
  </Admin>
);

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/acerca" element={<AcercaBuenFin />} />
      <Route path="/consumidores" element={<Consumidores />} />
      <Route path="/comercios" element={<Comercios />} />
      <Route path="/preguntas-frecuentes" element={<PreguntasFrecuentes />} />
      <Route path="/compra-segura" element={<CompraSegura />} />
      <Route path="/empresas" element={<EmpresasRegistradas />} />
      <Route path="/sucursales" element={<SucursalesRegistradas />} />
      <Route path="/admin/*" element={<AdminPanel />} />
      <Route path="/fraudes" element={<Fraudes />} />
      <Route path="/empresas-busqueda" element={<BuscarEmpresas />} />
      <Route path="/businesses" element={<BuscarEmpresas />} />
      <Route path="/businesses/:id/show" element={<DetalleComercio />} />
      <Route path="/datos-personales" element={<DatosCuenta />} />
      <Route path="/directorio/*" element={<Directorio />} />
      <Route path="/directorio/catalogOffers/:id/show" element={<DetalleOferta />} />
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/vacancies" element={<Jobs />} />
      <Route path="/vacancies/:id/show/" element={<DetalleVacante />} />

      {/*<Route path="/avisos" element={<Avisos />} /> */}
    </Routes>
  );
}