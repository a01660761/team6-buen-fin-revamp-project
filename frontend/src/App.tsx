/* import { Admin, Resource, ListGuesser, ShowGuesser } from "react-admin";
import { Layout } from "./Layout";
import { dataProvider } from "./dataProvider";
import { UserList, UserEdit, UserCreate } from "./users";
import { PostList, PostEdit, PostCreate } from "./post";
import { CommentList, CommentEdit, CommentCreate } from "./comment";
import { AlbumList, AlbumEdit, AlbumCreate } from "./album";
import { PhotoList, PhotoEdit, PhotoCreate } from "./photo";
import { ToDoList, ToDoEdit, ToDoCreate } from "./to_do";
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

export const App = () => (
  <Admin dataProvider={dataProvider} authProvider={authProvider} dashboard={Dashboard} i18nProvider={i18nProvider} loginPage={LoginPage} >
    <Resource name="users" list={UserList} show={ShowGuesser} edit={UserEdit} create={UserCreate} icon={UserIcon} />
    <Resource name="posts" list={PostList} edit={PostEdit} create={PostCreate} icon={PostIcon} />
    <Resource name="comments" list={CommentList} edit={CommentEdit} create={CommentCreate} icon={CommentIcon} />
    <Resource name="albums" list={AlbumList} edit={AlbumEdit} create={AlbumCreate} icon={AlbumIcon} />
    <Resource name="photos" list={PhotoList} edit={PhotoEdit} create={PhotoCreate} icon={PhotoIcon} />
    <Resource name="todos" list={ToDoList} edit={ToDoEdit} create={ToDoCreate} icon={TodoIcon} />
  </Admin>
);
 */

import Landing from "@/pages/Landing";

export const App = () => {
  return <Landing />;
};
