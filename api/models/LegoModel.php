<?php
class LegoModel
{
    //Conectarse a la BD
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }
    /**
     * Listar peliculas
     * @param 
     * @return $vResultado - Lista de objetos
     */
    public function all()
    {
        $imagenM = new ImageModel();
        $categoriaM = new CategoriaLegoModel();
        //Consulta SQL
        $vSQL = "SELECT * FROM lego order by id desc;";
        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSQL);
        if (!empty($vResultado) && is_array($vResultado)) {
            for ($i = 0; $i < count($vResultado); $i++) {
                //Imagen
                $vResultado[$i]->imagen = $imagenM->getImageMovie($vResultado[$i]->id);
                //Generos - genres
                $vResultado[$i]->genres = $categoriaM->getLegoCategoria($vResultado[$i]->id);
            }
        }
        //Retornar la respuesta
        return $vResultado;
    }
    /**
     * Obtener una pelicula
     * @param $id de la pelicula
     * @return $vresultado - Objeto pelicula
     */
    //
    public function get($id)
    {
        $categoriaM = new CategoriaLegoModel();
        $condicionM = new CondicionLegoModel();
        $usuarioM = new UsuariosModel();
        $imagenM = new ImageModel();
        $vSql = "SELECT * FROM lego
                    where id=$id;";

        //Ejecutar la consulta sql
        $vResultado = $this->enlace->executeSQL($vSql);
        if (!empty($vResultado)) {
            $vResultado = $vResultado[0];
            //Imagen
            $vResultado->imagen = $imagenM->getImageMovie($vResultado->id);
            //Categoria
            $vResultado->categoria = $categoriaM->getLegoCategoria($vResultado->id);
            //Condicion
            $vResultado->condicion = $condicionM->getLegoCondicion($vResultado->id);
            //Actores - actors
            $vResultado->usuario = $usuarioM->getUsuariosLego($vResultado->id);
        }

        //Retornar la respuesta
        return $vResultado;
    }
    /**
     * Obtener las Legos por vendedor
     * @param $idShopRental identificador de la tienda
     * @return $vresultado - Lista de peliculas incluyendo el precio
     */
    //
    //Obtener el inventario de películas de una tienda, incluyendo nombre de la película y precio
    public function legobyVendedor($idUsuario)
    {
        $imagenM = new ImageModel();
        //Consulta SQL
        $vSQL = "SELECT l.*, u.nombre_completo
                    FROM lego l, usuarios u
                    where l.id_vendedor=$idUsuario
                    order by l.nombre desc";
        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSQL);

        //Incluir imagenes
        if (!empty($vResultado) && is_array($vResultado)) {
            for ($i = 0; $i < count($vResultado); $i++) {
                $vResultado[$i]->imagen = $imagenM->getImageMovie(($vResultado[$i]->id));
            }
        }
        //Retornar la respuesta

        return $vResultado;
    }
    public function legoByEstado($idActor)
    {
        $imagenM = new ImageModel();
        //Consulta SQL
        $vSQL = "SELECT l.* 
                FROM lego l, estados_lego el
                where l.id_estado=$idActor";
        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSQL);
        //Retornar la respuesta

        return $vResultado;
    }
    /**
     * Obtener la cantidad de peliculas por genero
     * @param 
     * @return $vresultado - Cantidad de peliculas por genero
     */
    //
    public function getCountByGenre()
    {

        $vResultado = null;
        //Consulta sql
        $vSql = "SELECT count(l.id_categoria) as 'Cantidad', c.nombre as 'Categoria'
			FROM lego l, categorias c
			where c.id=l.id_categoria 
			group by c.id";

        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        // Retornar el objeto
        return $vResultado;
    }
    /**
     * Crear pelicula
     * @param $objeto pelicula a insertar
     * @return $this->get($idMovie) - Objeto pelicula
     */
    //
    public function create($objeto)
    {
        //Consulta sql

        //Ejecutar la consulta

        //Retornar pelicula

    }
    /**
     * Actualizar pelicula
     * @param $objeto pelicula a actualizar
     * @return $this->get($idMovie) - Objeto pelicula
     */
    //
    public function update($objeto)
    {
        //Consulta sql
        $sql = "Update movie SET title ='$objeto->title'," .
            "year ='$objeto->year',time ='$objeto->time',lang ='$objeto->lang'," .
            "director_id=$objeto->director_id" .
            " Where id=$objeto->id";

        //Ejecutar la consulta
        $cResults = $this->enlace->executeSQL_DML($sql);
        //--- Generos ---
        //Eliminar generos asociados a la pelicula
        $sql = "Delete from movie_genre where movie_id=$objeto->id";
        $vResultadoD = $this->enlace->executeSQL_DML($sql);
        //Insertar generos
        foreach ($objeto->genres as $item) {
            $sql = "Insert into movie_genre(movie_id,genre_id)" .
                " Values($objeto->id,$item)";
            $vResultadoG = $this->enlace->executeSQL_DML($sql);
        }
        //--- Actores ---
        //Eliminar actores asociados a la pelicula
        $sql = "Delete from movie_cast where movie_id=$objeto->id";
        $vResultadoD = $this->enlace->executeSQL_DML($sql);
        //Crear actores
        foreach ($objeto->actors as $item) {
            $sql = "Insert into movie_cast(movie_id,actor_id,role)" .
                " Values($objeto->id, $item->actor_id, '$item->role')";
            $vResultadoA = $this->enlace->executeSQL_DML($sql);
        }

        //Retornar pelicula
        return $this->get($objeto->id);
    }
}
