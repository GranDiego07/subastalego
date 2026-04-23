<?php

class pago  // minúsculas para que el router lo encuentre
{
    /**
     * POST /pago/crear
     * Body JSON: { id_subasta, id_usuario, nombre_usuario, monto }
     */
    public function crear()
    {
        try {
            $request  = new Request();
            $response = new Response();
            $input    = $request->getJSON();

            if (
                empty($input->id_subasta)     ||
                empty($input->id_usuario)     ||
                empty($input->nombre_usuario) ||
                empty($input->monto)
            ) {
                $response->toJSON([
                    "success" => false,
                    "message" => "Campos requeridos: id_subasta, id_usuario, nombre_usuario, monto"
                ]);
                return;
            }

            if (!is_numeric($input->monto) || floatval($input->monto) <= 0) {
                $response->toJSON(["success" => false, "message" => "El monto debe ser un número mayor a 0"]);
                return;
            }

            $Pago   = new PagoModel();
            $result = $Pago->crear($input);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * PUT /pago/confirmar/:id
     * El router en PUT con param llama a update($id)
     */
    public function update($id)
    {
        try {
            $request  = new Request();
            $response = new Response();
            $input    = $request->getJSON();

            if (empty($input->id_usuario)) {
                $response->toJSON(["success" => false, "message" => "Se requiere id_usuario"]);
                return;
            }

            $Pago = new PagoModel();
            $pago = $Pago->getById(intval($id));

            if (!$pago) {
                $response->toJSON(["success" => false, "message" => "Pago no encontrado"]);
                return;
            }

            if ((int)$pago->id_usuario !== (int)$input->id_usuario) {
                $response->toJSON(["success" => false, "message" => "No tienes permiso para confirmar este pago"]);
                return;
            }

            $result = $Pago->confirmar(intval($id));
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * GET /pago/getPorUsuario?id_usuario=X
     * Retorna los pagos PENDIENTES del usuario
     */
    public function getPorUsuario($param = null)
    {
        try {
            $response = new Response();
            // El router puede pasar el id como parámetro de ruta o viene como ?id_usuario=X
            $id_usuario = $param ?? $_GET['id_usuario'] ?? null;

            if (!$id_usuario) {
                $response->toJSON(["success" => false, "message" => "Se requiere id_usuario"]);
                return;
            }

            $Pago   = new PagoModel();
            $result = $Pago->getPorUsuario(intval($id_usuario));
            $response->toJSON(["success" => true, "data" => $result]);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * GET /pago/resumen/:id_usuario
     */
    public function resumen($id_usuario)
    {
        try {
            $response = new Response();
            $Pago     = new PagoModel();
            $result   = $Pago->resumenPorUsuario(intval($id_usuario));
            $response->toJSON(["success" => true, "data" => $result]);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * GET /pago/:id
     */
    public function getById($id)
    {
        try {
            $response = new Response();
            $Pago     = new PagoModel();
            $result   = $Pago->getById(intval($id));

            if (!$result) {
                $response->toJSON(["success" => false, "message" => "Pago no encontrado"]);
                return;
            }

            $response->toJSON(["success" => true, "data" => $result]);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
