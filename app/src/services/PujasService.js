import axios from 'axios';

// Asegúrate de que en tu .env VITE_BASE_URL termine en /
const BASE_URL = import.meta.env.VITE_BASE_URL + 'PujasController';

class PujasService {
    /**
     * Obtener listado de todas las pujas
     * GET /PujasController
     */
    getAll() {
        return axios.get(BASE_URL);
    }

    /**
     * Obtener una puja específica por ID
     * GET /PujasController/1
     */
    get(id) {
        return axios.get(`${BASE_URL}/${id}`);
    }

    /**
     * Obtener todas las pujas con detalles de usuario (Nombre, monto, etc.)
     * GET /PujasController/getPujaDetalle
     */
    getPujasDetalle() {
        return axios.get(`${BASE_URL}/getPujasDetalle`);
    }

    /**
     * Crear una nueva puja
     * POST /PujasController
     */
    create(data) {
        return axios.post(BASE_URL, data);
    }
}

export default new PujasService();