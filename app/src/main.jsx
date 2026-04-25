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
import Pagos from './components/Pujas/MisPagos'
import MiPerfil from './components/Usuarios/MiPerfil'
import MisPujas from './components/Pujas/MisPujas'
import Reportes from './components/Reportes/Reportes'
import { RoleRoute } from './components/Auth/RoleRoute'



const rutas = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },

      // — Legos —
      // Todos los roles pueden ver el listado
      { path: "lego", element: <ListLegos /> },

      // Solo administrador: tabla admin, update, detail
      {
        path: "table",
        element: (
          <RoleRoute requiredRoles={["administrador", "vendedor"]}>
            <TableLegos />
          </RoleRoute>
        ),
      },
      {
        path: "lego/update/:id",
        element: (
          <RoleRoute requiredRoles={["administrador", "vendedor"]}>
            <UpdateLego />
          </RoleRoute>
        ),
      },
      {
        path: "lego/detail/:id", element: (<DetailLego />),
      },

      // administrador y vendedor: crear lego
      {
        path: "lego/create",
        element: (
          <RoleRoute requiredRoles={["administrador", "vendedor"]}>
            <CreateLego />
          </RoleRoute>
        ),
      },

      // — Usuarios (solo administrador) —
      {
        path: "usuario",
        element: (
          <RoleRoute requiredRoles={["administrador"]}>
            <TableUsuarios />
          </RoleRoute>
        ),
      },
      {
        path: "usuario/create",
        element: (
          <RoleRoute requiredRoles={["administrador"]}>
            <CreateUsuario />
          </RoleRoute>
        ),
      },
      {
        path: "usuario/update/:id",
        element: (
          <RoleRoute requiredRoles={["administrador"]}>
            <UpdateUsuarios />
          </RoleRoute>
        ),
      },
      {
        path: "usuario/detail/:id",
        element: (
          <RoleRoute requiredRoles={["administrador"]}>
            <DetailUsuario />
          </RoleRoute>
        ),
      },

      // — Pujas y tabla de subastas (solo administrador) —
      {
        path: "pujas",
        element: (
          <RoleRoute requiredRoles={["administrador"]}>
            <TablePujas />
          </RoleRoute>
        ),
      },
      {
        path: "lego/subasta",
        element: (
          <RoleRoute requiredRoles={["administrador","vendedor"]}>
            <TableSubasta />
          </RoleRoute>
        ),
      },

      // — Gestión de subastas (administrador y vendedor) —
      {
        path: "lego/subasta/create",
        element: (
          <RoleRoute requiredRoles={["administrador", "vendedor"]}>
            <CreateSubasta />
          </RoleRoute>
        ),
      },
      {
        path: "lego/subasta/update/:id",
        element: (
          <RoleRoute requiredRoles={["administrador", "vendedor"]}>
            <UpdateSubasta />
          </RoleRoute>
        ),
      },
      {
        path: "lego/subasta/publicar/:id",
        element: (
          <RoleRoute requiredRoles={["administrador", "vendedor"]}>
            <PublicarSubasta />
          </RoleRoute>
        ),
      },

      // — Subastas activas (todos los roles) —
      { path: "subasta/activas", element: <ListSubastasActi /> },

      // — Subastas no activas (solo administrador y vendedor) —
      {
        path: "subasta/noactivas",
        element: (
          <RoleRoute requiredRoles={["administrador", "vendedor"]}>
            <ListSubastasDesa />
          </RoleRoute>
        ),
      },

      // — Detalle de subasta (administrador y comprador) —
      {
        path: "subasta/detalle/:id", element: (<SubastaDetalle />),
      },

      // — Pagos (solo administrador) —
      {
        path: "pagos",
        element: (
          <RoleRoute requiredRoles={["administrador", "comprador"]}>
            <Pagos />
          </RoleRoute>
        ),
      },

      // — Mis pujas (comprador) —
      {
        path: "mis-pujas",
        element: (
          <RoleRoute requiredRoles={["comprador"]}>
            <MisPujas />
          </RoleRoute>
        ),
      },

      // — Perfil propio —
      { path: "perfil", element: <MiPerfil /> },

      // — Reportes (solo administrador) —
      {
        path: "reportes",
        element: (
          <RoleRoute requiredRoles={["administrador"]}>
            <Reportes />
          </RoleRoute>
        ),
      },

      // — Autenticación (públicas) —
      { path: "login", element: <Login /> },
      { path: "create", element: <Register /> },

      // Comodín 404 — siempre al final
      { path: "*", element: <PageNotFound /> },
    ],
  },
]);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={rutas} />
    </UserProvider>
  </StrictMode>,
)