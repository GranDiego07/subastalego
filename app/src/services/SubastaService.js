import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'subasta';

class SubastaService {
    /**
       * Obtener listado de todos los Subasta
       * GET /Subasta
       */
    getAll() {
        return axios.get(BASE_URL);
    }
    allConDetalle(id, rol) {
        if (!id || !rol) return Promise.reject(new Error("id y rol son requeridos"));
        return axios.get(`${BASE_URL}/allConDetalle/${id}/${rol}`);
    }
    /**
     * Obtener un usuario específico por ID
     * GET /Subasta/5
     */
    getById(subastaId) {
        return axios.get(`${BASE_URL}/${subastaId}`);
    }
    getSubastaActiva() {
        // Esto llamará a la función getSubastaActiva en el controlador
        return axios.get(`${BASE_URL}/getSubastaActiva`);
    }

    getSubastasCanFin() {
        // Esto llamará a la función getSubastasCanFin en el controlador
        return axios.get(`${BASE_URL}/getSubastasCanFin`);
    }
    getDetalleSubasta(id) {
        return axios.get(`${BASE_URL}/getDetalleSubasta/${id}`);
    }
    getHistorialPujas(id) {
        return axios.get(`${BASE_URL}/getHistorialPujas/${id}`);
    }

    /**
   * Crear nuevo subasta
   * POST /subasta
   */
    create($subasta) {
        return axios.post(BASE_URL, JSON.stringify($subasta), {
            headers: { "Content-Type": "application/json" }  // ✅ Agregar esto
        });
    }
    update(subasta) {
        return axios({
            method: 'put',
            url: BASE_URL,
            data: JSON.stringify(subasta)

        })
    }
    getConDetalle(id) {
        return axios.get(`${BASE_URL}/getConDetalle/${id}`);
    }

    publicar(id) {
        return axios.get(`${BASE_URL}/publicar/${id}`);
    }

    cancelar(id) {
        return axios.get(`${BASE_URL}/cancelar/${id}`);
    }
    reactivar(id) {
        return axios.get(`${BASE_URL}/reactivar/${id}`);
    }
    getParaInterfaz(id) {
        // Tu controlador PHP usa $_GET['id'] como respaldo, 
        // pero esta forma es más limpia si tu router soporta parámetros de ruta.
        return axios.get(`${BASE_URL}/getParaInterfaz/${id}`);
    }

    /**
     * Registra una puja
     * @param {Object} datosPuja - Debe contener { id_subasta, monto }
     */
    pujar(datosPuja) {
        return axios.post(`${BASE_URL}/pujar`, JSON.stringify(datosPuja), {
            headers: { "Content-Type": "application/json" }
        });
    }

    /**
     * Obtiene el nombre de un usuario por ID
     */
    getNombreUsuario(id) {
        return axios.get(`${BASE_URL}/getNombreUsuario/${id}`);
    }
    /**
 * Cierra una subasta (se llama automáticamente cuando vence el countdown)
 * POST /subasta/cerrar
 */
    cerrar(id) {
        return axios.post(`${BASE_URL}/cerrar`,
            JSON.stringify({ id_subasta: id }),
            {
                headers: { "Content-Type": "application/json" }
            }
        );
    }
}
export default new SubastaService();