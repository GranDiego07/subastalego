<?php

class subasta  // ← Debe estar en minúsculas para que el router la encuentre
{
    public function index()
    {
        try {
            $response = new Response();
            //Obtener el listado del Modelo
            $Subasta = new SubastaModel();
            $result = $Subasta->all();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }
    public function get($param)
    {
        try {
            $response = new Response();
            $Subasta = new SubastaModel();
            $result = $Subasta->get($param);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }
    public function getSubastaActiva()
    {
        try {
            $response = new Response();
            $Subasta = new SubastaModel();
            $result = $Subasta->getSubastasActivas();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }
    public function getSubastasCanFin()
    {
        try {
            $response = new Response();
            $Subasta = new SubastaModel();
            $result = $Subasta->getSubastasCanFin();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }
    public function getDetalleSubasta($id)
    {
        try {
            $response = new Response();
            $Subasta = new SubastaModel();
            $result = $Subasta->getDetalleSubasta($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }
    public function getConDetalle($id)
    {
        try {
            $response = new Response();
            $Subasta = new SubastaModel();
            $result = $Subasta->getConDetalle($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }
    public function getHistorialPujas($id)
    {
        try {
            $response = new Response();
            $Subasta = new SubastaModel();
            $result = $Subasta->getHistorialPujas($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    public function create()
    {
        try {
            $request = new Request();
            $response = new Response();
            $inputJSON = $request->getJSON();
            $Subasta = new SubastaModel();
            $result = $Subasta->create($inputJSON);
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON(["error" => $e->getMessage()]);
            handleException($e);
        }
    }
    public function allConDetalle($id, $rol)
    {
        try {
            $response = new Response();
            $Subasta = new SubastaModel();
            $result = $Subasta->allConDetalle($id, $rol);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    public function update()
    {
        try {
            $request = new Request();
            $response = new Response();
            //Obtener json enviado
            $inputJSON = $request->getJSON();
            //Instancia del modelo
            $Subasta = new SubastaModel();
            //Acción del modelo a ejecutar
            $result = $Subasta->update($inputJSON);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }
    public function publicar($id)
    {
        try {
            $response = new Response();
            $subasta  = new SubastaModel();
            $result   = $subasta->publicar(intval($id));
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON(["error" => $e->getMessage()]);
        }
    }

    public function cancelar($id)
    {
        try {
            $response = new Response();
            $subasta  = new SubastaModel();
            $result   = $subasta->cancelar(intval($id));
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON(["error" => $e->getMessage()]);
        }
    }
    public function reactivar($id)
    {
        try {
            $response = new Response();
            $Subasta = new SubastaModel();
            $result = $Subasta->reactivar($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }
    private $USUARIO_ACTUAL_ID = 1;
    // 1. Añade "= null" para que PHP no explote si el router falla al enviar el dato
    public function getParaInterfaz($id = null)
    {
        try {
            $response = new Response();

            // 2. Si $id llega nulo desde el router, intentamos pescarlo de la URL (?id=XX)
            if ($id === null) {
                $id = $_GET['id'] ?? null;
            }

            // 3. Si sigue siendo nulo, respondemos con error 400 en lugar de morir con error 500
            if (!$id) {
                $response->toJSON(["error" => "ID de subasta no proporcionado"], 400);
                return;
            }

            $Subasta = new SubastaModel();
            $subasta = $Subasta->getParaInterfaz(intval($id));

            if (!$subasta) {
                $response->toJSON(["error" => "Subasta no encontrada"]);
                return;
            }

            $pujas   = $Subasta->getHistorialPujasOrdenado(intval($id));
            $pujaMax = $Subasta->getPujaMaxima(intval($id));

            $response->toJSON([
                "subasta"        => $subasta,
                "pujas"          => $pujas,
                "puja_maxima"    => $pujaMax,
                "usuario_actual" => $this->USUARIO_ACTUAL_ID,
            ]);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * POST /subasta/pujar
     * Body JSON: { id_subasta: int, monto: float }
     * El usuario se toma de $USUARIO_ACTUAL_ID (variable lógica interna).
     */
    public function pujar()
    {
        try {
            $request   = new Request();
            $response  = new Response();
            $input     = $request->getJSON();
            $Subasta   = new SubastaModel();

            $id_subasta = intval($input->id_subasta ?? 0);
            $monto      = floatval($input->monto     ?? 0);
            $id_usuario = intval($input->id_usuario  ?? $this->USUARIO_ACTUAL_ID);

            if ($id_subasta <= 0 || $monto <= 0) {
                $response->toJSON(["error" => "Datos inválidos"]);
                return;
            }

            $subasta = $Subasta->getParaInterfaz($id_subasta);
            if (!$subasta) {
                $response->toJSON(["error" => "Subasta no encontrada"]);
                return;
            }

            if (strtolower($subasta->estado) !== 'activa') {
                $response->toJSON(["error" => "La subasta no está activa"]);
                return;
            }

            if ((int)$subasta->id_creador === $id_usuario) {
                $response->toJSON(["error" => "El vendedor no puede pujar en su propia subasta"]);
                return;
            }

            $pujaMax     = $Subasta->getPujaMaxima($id_subasta);
            $montoActual = $pujaMax ? floatval($pujaMax->monto) : floatval($subasta->precio_base);

            if ($monto <= $montoActual) {
                $response->toJSON(["error" => "El monto debe ser mayor a la puja actual"]);
                return;
            }

            $incremento = floatval($subasta->incremento_minimo);
            if (($monto - $montoActual) < $incremento) {
                $response->toJSON(["error" => "El incremento mínimo es " . number_format($incremento, 2)]);
                return;
            }

            $Subasta->registrarPuja($id_subasta, $id_usuario, $monto);

            $nombreUsuarioData = $Subasta->getNombreUsuario($id_usuario);
            $nombreUsuario = $nombreUsuarioData->nombre ?? "Usuario " . $id_usuario;

            $this->publicarAbly("auction-{$id_subasta}", "new-bid", [
                "id_subasta"     => $id_subasta,
                "monto"          => $monto,
                "id_usuario"     => $id_usuario,
                "usuario_nombre" => $nombreUsuario,
                "fecha_hora"     => date("Y-m-d H:i:s"),
            ]);

            $response->toJSON([
                "success" => true,
                "monto"   => $monto,
                "usuario" => $nombreUsuario,
            ]);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Envía la notificación a Ably vía REST API
     */
    private function publicarAbly($canal, $evento, $data)
    {
        // 1. Cargamos el archivo de configuración manualmente para estar seguros
        $config = [];
        $rutaConfig = __DIR__ . '/config.php'; // Si config.php está en la misma carpeta

        if (file_exists($rutaConfig)) {
            $config = require $rutaConfig;
        }

        // 2. Buscamos la llave en el config o usamos la que ya tienes
        $apiKey = $config['ABLY_API_KEY'] ?? 'fqH_DA.cmymYw:nSw8u0Itnu2-pxfonc6OdYvTeuJSDjjJgPBDKADTyx0';

        // 3. Si NO hay llave, simplemente salimos de la función SIN dar error 500
        if (!$apiKey || $apiKey === 'TU_API_KEY_AQUI') {
            error_log("Aviso: ABLY_API_KEY no configurada. Saltando notificación.");
            return;
        }

        $url     = "https://rest.ably.io/channels/" . urlencode($canal) . "/messages";
        $payload = json_encode(["name" => $evento, "data" => $data]);

        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => $payload,
            CURLOPT_HTTPHEADER     => [
                "Content-Type: application/json",
                "Authorization: Basic " . base64_encode($apiKey),
            ],
            CURLOPT_TIMEOUT        => 5 // Añadimos un tiempo de espera para que no se quede pegado
        ]);

        $res = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode >= 400) {
            error_log("Ably Error ($httpCode): " . $res);
        }
    }
    public function getNombreUsuario($id)
    {
        try {
            $response = new Response();
            $Subasta = new SubastaModel();
            $result = $Subasta->getNombreUsuario($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    /**
     * POST /subasta/cerrar
     * Body JSON: { id_subasta: int }
     */
    public function cerrar()
    {
        try {
            $request  = new Request();
            $response = new Response();
            $input    = $request->getJSON();

            $id_subasta = intval($input->id_subasta ?? 0);

            if ($id_subasta <= 0) {
                $response->toJSON(["success" => false, "message" => "ID de subasta requerido"], 400);
                return;
            }

            $Subasta = new SubastaModel();
            $result  = $Subasta->cerrar($id_subasta);

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
