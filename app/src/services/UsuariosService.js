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
    * Obtener listado de todos los usuarios que son vendedores
    * GET /usuarios
    */
  getByRol() {
    return axios.get(`${BASE_URL}/getByRol`);
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

  toggleEstado(id){
    return axios.get(`${BASE_URL}/toggleEstado/${id}`)
  }

  /**
   * Crear nuevo usuario
   * POST /usuarios
   * Datos requeridos: nombre_completo, email, password, rol
   */
  create($usuariodata) {
    return axios.post(BASE_URL, JSON.stringify($usuariodata));
  }

  /**
   * Actualizar un usuario
   * PUT /usuarios
   */
  update(usuario) {
    return axios({
      method: 'put',
      url: BASE_URL,
      data: JSON.stringify(usuario)

    })
  }

  /**
   * Eliminar un usuario
   * DELETE /usuarios/5
   */
  delete(usuarioId) {
    return axios.delete(`${BASE_URL}/${usuarioId}`);
  }
  
  loginUser(User) {
    return axios.post(BASE_URL + '/login/', JSON.stringify(User));
  }
}

export default new UsuariosService();