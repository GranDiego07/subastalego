<?php

class pago  // minúsculas para que el router lo encuentre
{
    /**
     * POST /pago/crear
     * Registra el pago de una subasta finalizada.
     * El usuario ganador lo determina el sistema automáticamente —
     * no existe campo para seleccionar el usuario desde el cliente.
     * Body JSON: { id_subasta, id_usuario, nombre_usuario, monto, notas? }
     */
    public function crear()
    {
        try {
            $request  = new Request();
            $response = new Response();
            $input    = $request->getJSON();

            if (
                empty($input->id_subasta)    ||
                empty($input->id_usuario)    ||
                empty($input->nombre_usuario)||
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
     * Confirma un pago pendiente.
     * Body JSON: { id_usuario }  — valida que el usuario sea el dueño del pago.
     */
    public function confirmar($id)
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
     * GET /pago/usuario?id_usuario=1
     * Lista todos los pagos de un usuario.
     */
    public function getPorUsuario()
    {
        try {
            $response   = new Response();
            $id_usuario = $_GET['id_usuario'] ?? null;

            if (!$id_usuario) {
                $response->toJSON(["success" => false, "message" => "Se requiere id_usuario como query param"]);
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
     * Resumen estadístico de pagos de un usuario.
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
     * Detalle de un pago específico.
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

            $response->toJSON($result);

        } catch (Exception $e) {
            handleException($e);
        }
    }
}
