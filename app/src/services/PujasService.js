import axios from 'axios';

// Asegúrate de que en tu .env VITE_BASE_URL termine en /
const BASE_URL = import.meta.env.VITE_BASE_URL + 'pujas';

class PujasService {
    /**
     * Obtener listado de todas las pujas
     * GET /pujas
     */
    getAll() {
        return axios.get(BASE_URL);
    }

    /**
     * Obtener una puja específica por ID
     * GET /pujas/getById/1
     */
    getById(id) {
        return axios.get(`${BASE_URL}/getById/${id}`);
    }

    /**
     * Obtener todas las pujas con detalles de usuario (Nombre, monto, etc.)
     * GET /pujas/getPujaDetalle
     */
    getPujasDetalle() {
        return axios.get(`${BASE_URL}/getPujasDetalle`);
    }

    /**
     * Crear una nueva puja
     * POST /pujas
     */
    create(data) {
        return axios.post(BASE_URL, data);
    }
}

export default new PujasService();