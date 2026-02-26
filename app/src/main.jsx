import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'
import { Home } from './components/Home/Home'
import { PageNotFound } from './components/Home/PageNotFound'
import { ListLegos } from './components/Lego/ListLegos'
import { DetailLego } from './components/Lego/DetailLegos'
import TableLegos from './components/Lego/TableLegos'
import TableUsuarios from './components/Usuarios/TableUsuario'
import TablePujas from './components/Pujas/TablePujas'
import { DetailUsuario } from './components/Usuarios/DetailUsuario'
import { ListSubastasActi } from './components/Subastas/ListSubastasActi'
import { ListSubastasDesa } from './components/Subastas/ListSubastasDesa'
import { DetailSubasta } from './components/Subastas/DetailSubasta'

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
      { path: "lego/detail/:id", element: <DetailLego /> },
      { path: "lego/usuarios", element: <TableUsuarios /> },
      { path: "lego/usuarios/detail/:id", element: <DetailUsuario /> },
      { path: "lego/pujas", element: <TablePujas /> },
      { path: "lego/subasta/activas", element: <ListSubastasActi /> },
      { path: "lego/subasta/noactivas", element: <ListSubastasDesa /> },
      { path: "lego/subasta/detalle/:id", element: <DetailSubasta /> }
    ]
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={rutas} />
  </StrictMode>,
)

