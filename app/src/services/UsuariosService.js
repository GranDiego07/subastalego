import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'usuarios';

class UsuariosService {
  /**
   * Obtener listado de todos los usuarios
   * GET /usuarios
   */
  getAll() {
    return axios.get(BASE_URL);
  }

  /**
   * Obtener un usuario específico por ID
   * GET /usuarios/5
   */
  getById(usuarioId) {
    return axios.get(`${BASE_URL}/${usuarioId}`);
  }

  /**
   * Obtener usuarios y sus Legos
   * GET /usuarios/getUsuariosLego/5
   */
  getUsuariosLego(legoId) {
    return axios.get(`${BASE_URL}/getUsuariosLego/${legoId}`);
  }

  getUsuarioDetalleId(id) {
    // Cambiado de 'getUsuariosId' a 'getUsuarioDetalleId' para coincidir con el controlador
    return axios.get(`${BASE_URL}/getUsuarioDetalleId/${id}`);
}
  /**
 * Obtener todos usuarios detallado
 * GET /usuarios/getUsuarios/
 */
  getUsuarioDetalle() {
    return axios.get(`${BASE_URL}/getusuarioDetalle`);
  }
  getUsuarioList() {
    return axios.get(`${BASE_URL}/getusuarioList`);
  }
  /**
   * Crear nuevo usuario
   * POST /usuarios
   * Datos requeridos: nombre_completo, email, password, rol
   */
  create(usuarioData) {
    return axios.post(BASE_URL, usuarioData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Login de usuario
   * POST /usuarios/login
   * Datos requeridos: email, password
   */
  login(credentials) {
    return axios.post(`${BASE_URL}/login`, credentials, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Actualizar un usuario
   * PUT /usuarios
   */
  update(usuarioData) {
    return axios.put(BASE_URL, usuarioData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Eliminar un usuario
   * DELETE /usuarios/5
   */
  delete(usuarioId) {
    return axios.delete(`${BASE_URL}/${usuarioId}`);
  }
}

export default new UsuariosService();