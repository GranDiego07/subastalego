import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'
import { Home } from './components/Home/Home'
import { PageNotFound } from './components/Home/PageNotFound'
import { ListLegos } from './components/Lego/ListLegos'
import { DetailLego } from './components/Lego/DetailLegos'
import { CreateLego } from './components/Lego/CreateLego'
import TableLegos from './components/Lego/TableLegos'
import { UpdateLego } from './components/Lego/UpdateLego'
import TableUsuarios from './components/Usuarios/TableUsuario'
import TablePujas from './components/Pujas/TablePujas'
import { DetailUsuario } from './components/Usuarios/DetailUsuario'
import { CreateUsuario } from './components/Usuarios/CreateUsuario'
import { ListSubastasActi } from './components/Subastas/ListSubastasActi'
import { ListSubastasDesa } from './components/Subastas/ListSubastasDesa'
import { DetailSubasta } from './components/Subastas/DetailSubasta'
import { CreateSubasta } from './components/Subastas/CreateSubasta'
import TableSubasta from './components/Subastas/TableSubastas'
import { UpdateSubasta } from './components/Subastas/UpdateSubasta'
import { UpdateUsuarios } from './components/Usuarios/UpdateUsuarios'


const rutas = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      // Ruta principal
      { index: true, element: <Home /> },

      // Ruta comodín (404)
      { path: "*", element: <PageNotFound /> },
      //Rutas componentes
      { path: "lego", element: <ListLegos /> },
      { path: "lego/table", element: <TableLegos /> },
      { path: "lego/create", element: <CreateLego /> },
      { path: "lego/update/:id", element: <UpdateLego /> },
      { path: "lego/detail/:id", element: <DetailLego /> },
      { path: "lego/usuarios", element: <TableUsuarios /> },
      { path: "lego/usuarios/create", element: <CreateUsuario /> },
      { path: "lego/usuarios/update/:id", element: <UpdateUsuarios /> },
      { path: "lego/usuarios/detail/:id", element: <DetailUsuario /> },
      { path: "lego/pujas", element: <TablePujas /> },
      { path: "lego/subasta", element: <TableSubasta /> },
      { path: "lego/subasta/activas", element: <ListSubastasActi /> },
      { path: "lego/subasta/noactivas", element: <ListSubastasDesa /> },
      { path: "lego/subasta/detalle/:id", element: <DetailSubasta /> },
      { path: "lego/subasta/create", element: <CreateSubasta /> },
      { path: "lego/subasta/update/:id", element: <UpdateSubasta /> },
    ]
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={rutas} />
  </StrictMode>,
)


