import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'
import { Home } from './components/Home/Home'
import { PageNotFound } from './components/Home/PageNotFound'
import TableMovies from './components/Lego/TableLegos'
import { ListLegos } from './components/Lego/ListLegos'
import { DetailMovie } from './components/Lego/DetailLegos'

const rutas = createBrowserRouter([
  {
    element: <Layout/>,
    children: [
      // Ruta principal
      { index: true, element: <Home /> },

      // Ruta comodín (404)
      { path: "*", element: <PageNotFound /> },
       //Rutas componentes
      {path:"lego/table", element: <TableMovies/>},
      {path:"lego", element: <ListLegos/>},
      {path:"lego/detail/:id", element: <DetailMovie />}
    ]
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={rutas} />
  </StrictMode>,
)
