import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'pago';

class PagoService {

    /**
     * Registrar el pago de una subasta finalizada.
     * El usuario ganador lo determina el sistema automáticamente.
     * POST /pago/crear
     * @param {{ id_subasta: number, id_usuario: number, nombre_usuario: string, monto: number, notas?: string }} datosPago
     */
    crear(datosPago) {
        return axios.post(`${BASE_URL}/crear`, JSON.stringify(datosPago), {
            headers: { "Content-Type": "application/json" }
        });
    }

    /**
     * Confirmar un pago pendiente.
     * PUT /pago/confirmar/:id
     * @param {number} id       - ID del pago
     * @param {number} id_usuario - Usuario que confirma (debe ser el dueño)
     */
    confirmar(id, id_usuario) {
        return axios({
            method: 'put',
            url: `${BASE_URL}/confirmar/${id}`,
            data: JSON.stringify({ id_usuario }),
            headers: { "Content-Type": "application/json" }
        });
    }

    /**
     * Listar todos los pagos de un usuario.
     * GET /pago/getPorUsuario?id_usuario=1
     */
    getPorUsuario(id_usuario) {
        return axios.get(`${BASE_URL}/getPorUsuario?id_usuario=${id_usuario}`);
    }

    /**
     * Resumen estadístico de pagos de un usuario.
     * GET /pago/resumen/:id_usuario
     */
    resumen(id_usuario) {
        return axios.get(`${BASE_URL}/resumen/${id_usuario}`);
    }

    /**
     * Detalle de un pago específico.
     * GET /pago/:id
     */
    getById(id) {
        return axios.get(`${BASE_URL}/${id}`);
    }
}

export default new PagoService();
