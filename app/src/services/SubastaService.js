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
}
export default new SubastaService();