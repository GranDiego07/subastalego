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
      { path: "lego/pujas", element: <TablePujas /> }
    ]
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={rutas} />
  </StrictMode>,
)
