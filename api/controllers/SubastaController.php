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
    public function allConDetalle()
    {
        try {
            $response = new Response();
            $Subasta = new SubastaModel();
            $result = $Subasta->allConDetalle();
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

            // ── Validaciones básicas ──────────────────────────────────────
            if ($id_subasta <= 0 || $monto <= 0) {
                $response->toJSON(["error" => "Datos inválidos"]);
                return;
            }

            // ── 1. Obtener subasta (verificarCierre se llama dentro) ──────
            $subasta = $Subasta->getParaInterfaz($id_subasta);
            if (!$subasta) {
                $response->toJSON(["error" => "Subasta no encontrada"]);
                return;
            }

            // ── 2. Validar estado activo ──────────────────────────────────
            if (strtolower($subasta->estado) !== 'activa') {
                $response->toJSON(["error" => "La subasta no está activa"]);
                return;
            }

            // ── 3. Validar que el usuario no sea el vendedor ──────────────
            if ((int)$subasta->id_creador === $this->USUARIO_ACTUAL_ID) {
                $response->toJSON(["error" => "El vendedor no puede pujar en su propia subasta"]);
                return;
            }

            // ── 4. Obtener puja máxima actual ─────────────────────────────
            $pujaMax     = $Subasta->getPujaMaxima($id_subasta);
            $montoActual = $pujaMax
                ? floatval($pujaMax->monto)
                : floatval($subasta->precio_base);

            // ── 5. Validar monto mayor ────────────────────────────────────
            if ($monto <= $montoActual) {
                $response->toJSON([
                    "error" => "El monto debe ser mayor a la puja actual (" . number_format($montoActual, 2) . ")"
                ]);
                return;
            }

            // ── 6. Validar incremento mínimo ──────────────────────────────
            $incremento = floatval($subasta->incremento_minimo);
            if (($monto - $montoActual) < $incremento) {
                $response->toJSON([
                    "error" => "El incremento mínimo es " . number_format($incremento, 2)
                ]);
                return;
            }

            // ── 7. Registrar puja ─────────────────────────────────────────
            $Subasta->registrarPuja($id_subasta, $this->USUARIO_ACTUAL_ID, $monto);

            // ── 8. Publicar evento en Ably ────────────────────────────────
            // Obtener nombre del usuario actual para el evento
            $nombreUsuario = $this->getNombreUsuario($this->USUARIO_ACTUAL_ID);
            $this->publicarAbly("auction-{$id_subasta}", "new-bid", [
                "id_subasta"     => $id_subasta,
                "monto"          => $monto,
                "id_usuario"     => $this->USUARIO_ACTUAL_ID,
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
 
    // ── Helpers privados ─────────────────────────────────────────────────────

    /**
     * Publica un evento en Ably usando la REST API (sin SDK, solo cURL).
     */
    private function publicarAbly($canal, $evento, $data)
    {
        $apiKey = $_ENV['ABLY_API_KEY'] ?? getenv('ABLY_API_KEY') ?? '';
        if (!$apiKey) {
            error_log("ABLY_API_KEY no configurada");
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
        ]);
        $res = curl_exec($ch);
        curl_close($ch);

        error_log("Ably publish [$canal/$evento]: $res");
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
}
