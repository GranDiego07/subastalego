import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import UserProvider from '@/context/UserProvider'
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
import { CreateSubasta } from './components/Subastas/CreateSubasta'
import TableSubasta from './components/Subastas/TableSubastas'
import { UpdateSubasta } from './components/Subastas/UpdateSubasta'
import { UpdateUsuarios } from './components/Usuarios/UpdateUsuarios'
import { PublicarSubasta } from './components/Subastas/PublicarSubasta'
import Login from './components/Usuarios/Login'
import Register from './components/Usuarios/Register'
import SubastaDetalle from './components/Subastas/SubastaDetalle'



const rutas = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },

      { path: "lego", element: <ListLegos /> },
      { path: "table", element: <TableLegos /> },
      { path: "lego/create", element: <CreateLego /> },
      { path: "lego/update/:id", element: <UpdateLego /> },
      { path: "lego/detail/:id", element: <DetailLego /> },
      { path: "usuario", element: <TableUsuarios /> },
      { path: "usuario/create", element: <CreateUsuario /> },
      { path: "usuario/update/:id", element: <UpdateUsuarios /> },
      { path: "usuario/detail/:id", element: <DetailUsuario /> },
      { path: "login", element: <Login /> },
      { path: 'create', element: <Register /> },
      { path: "pujas", element: <TablePujas /> },
      { path: "lego/subasta", element: <TableSubasta /> },
      { path: "subasta/activas", element: <ListSubastasActi /> },
      { path: "subasta/noactivas", element: <ListSubastasDesa /> },
      { path: "subasta/detalle/:id", element: <SubastaDetalle /> },
      { path: "lego/subasta/create", element: <CreateSubasta /> },
      { path: "lego/subasta/update/:id", element: <UpdateSubasta /> },
      { path: "lego/subasta/publicar/:id", element: <PublicarSubasta /> },
      { path: "*", element: <PageNotFound /> },  // ← siempre al final
    ]
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={rutas} />
    </UserProvider>
  </StrictMode>,
)