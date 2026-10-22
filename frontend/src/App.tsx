/* import { Admin, Resource, ListGuesser, ShowGuesser } from "react-admin";
import { Layout } from "./Layout";
import { dataProvider } from "./dataProvider";
import { UserList, UserEdit, UserCreate } from "./users";
import { PostList, PostEdit, PostCreate } from "./post";
import { CommentList, CommentEdit, CommentCreate } from "./comment";
import { AlbumList, AlbumEdit, AlbumCreate } from "./album";
import { PhotoList, PhotoEdit, PhotoCreate } from "./photo";
import { ToDoList, ToDoEdit, ToDoCreate } from "./to_do";
import { BusinessList, BusinessShow } from "./business"; // NUEVA
import { Dashboard } from "./Dashboard";
import { authProvider } from './AuthProvider';
import { i18nProvider } from "./i18nProvider";
import { LoginPage } from "./LoginPage";

import UserIcon from "@mui/icons-material/Group";
import PostIcon from "@mui/icons-material/Article";
import CommentIcon from "@mui/icons-material/Comment";
import AlbumIcon from "@mui/icons-material/PhotoAlbum";
import PhotoIcon from "@mui/icons-material/Photo";
import TodoIcon from "@mui/icons-material/Checklist";
import StoreIcon from "@mui/icons-material/Store"; // NUEVA

export const App = () => (
  <Admin dataProvider={dataProvider} authProvider={authProvider} dashboard={Dashboard} i18nProvider={i18nProvider} loginPage={LoginPage} >
    <Resource name="users" list={UserList} show={ShowGuesser} edit={UserEdit} create={UserCreate} icon={UserIcon} />
    <Resource name="posts" list={PostList} edit={PostEdit} create={PostCreate} icon={PostIcon} />
    <Resource name="comments" list={CommentList} edit={CommentEdit} create={CommentCreate} icon={CommentIcon} />
    <Resource name="albums" list={AlbumList} edit={AlbumEdit} create={AlbumCreate} icon={AlbumIcon} />
    <Resource name="photos" list={PhotoList} edit={PhotoEdit} create={PhotoCreate} icon={PhotoIcon} />
    <Resource name="todos" list={ToDoList} edit={ToDoEdit} create={ToDoCreate} icon={TodoIcon} />
    <Resource name="businesses" list={BusinessList} show={BusinessShow} icon={StoreIcon} />
  </Admin>
);*/

import { Routes, Route } from "react-router-dom";
import { Admin, Resource } from "react-admin"; // NUEVO
import Landing from "@/pages/Landing";
import Consumidores from "@/pages/Consumidores";
import Comercios from "@/pages/Comercios";
import PreguntasFrecuentes from "./pages/PreguntasFrecuentes";
import CompraSegura from "@/pages/CompraSegura";
import AcercaBuenFin from "@/pages/AcercaBuenFin";
import EmpresasRegistradas from "./pages/EmpresasRegistradas";
import SucursalesRegistradas from "./pages/SucuralesRegistradas";
import { dataProvider } from "./dataProvider"; // NUEVO
import { i18nProvider } from "./i18nProvider"; // NUEVO
import { BusinessList, BusinessShow } from "./business"; // NUEVO
import { OfferShow } from "./offer"; // NUEVO (#37)
import { VacancyList, VacancyShow } from "./vacancy"; // NUEVO (#43)
import StoreIcon from "@mui/icons-material/Store"; // NUEVO
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
      <Route path="/preguntas-frecuentas"element={<PreguntasFrecuentes/>} />
      <Route path="/compra-segura" element={<CompraSegura />} />
      <Route path="/empresas" element={<EmpresasRegistradas />} />
      <Route path="sucursales" element={<SucursalesRegistradas/>} />
      <Route path="/directorio/*" element={<Directorio />} /> {/* NUEVO */}
      {/*<Route path="/avisos" element={<Avisos />} /> */}
    </Routes>
  );
}