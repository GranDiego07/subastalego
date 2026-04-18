import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ChevronLeft, AlertTriangle, CheckCircle, Clock, TrendingUp } from "lucide-react";

const USUARIO_ACTUAL_ID = 1;
const BASE_URL = import.meta.env.VITE_BASE_URL ?? "";

function formatMonto(n) {
    return Number(n || 0).toLocaleString("es-CR", { style: "currency", currency: "CRC" });
}

function formatFecha(fecha) {
    return new Date(fecha).toLocaleDateString("es-CR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    });
}

export default function MisPagos() {
    const navigate = useNavigate();
    const [pagos, setPagos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [confirmando, setConfirmando] = useState(null);
    const [msgOk, setMsgOk] = useState("");
    const [msgError, setMsgError] = useState("");

    // Cargar pagos del usuario
    const cargarPagos = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(`${BASE_URL}/pago/usuario`, {
                params: { id_usuario: USUARIO_ACTUAL_ID }
            });

            setPagos(response.data.data || []);
        } catch (err) {
            console.error("Error al cargar pagos:", err);
            setError(err.response?.data?.error || "Error al cargar los pagos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarPagos();
    }, []);

    // Confirmar pago
    const handleConfirmarPago = async (pago_id) => {
        try {
            setMsgError("");
            setMsgOk("");
            setConfirmando(pago_id);

            const response = await axios.put(
                `${BASE_URL}/pago/confirmar/${pago_id}`,
                { id_usuario: USUARIO_ACTUAL_ID }
            );

            // Actualizar lista de pagos
            setPagos(prevPagos =>
                prevPagos.map(p =>
                    p.pago_id === pago_id
                        ? { ...p, estado: "confirmado", fecha_confirmacion: new Date().toISOString() }
                        : p
                )
            );

            setMsgOk("¡Pago confirmado correctamente!");

            // Limpiar mensaje después de 3 segundos
            setTimeout(() => setMsgOk(""), 3000);

        } catch (err) {
            setMsgError(err.response?.data?.error || "Error al confirmar pago");
            console.error("Error:", err);
        } finally {
            setConfirmando(null);
        }
    };

    // Contar pagos por estado
    const resumen = {
        total: pagos.length,
        pendientes: pagos.filter(p => p.estado === "pendiente").length,
        confirmados: pagos.filter(p => p.estado === "confirmado").length,
        monto_total: pagos.reduce((sum, p) => sum + parseFloat(p.monto || 0), 0)
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-zinc-950">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white pb-10">
            {/* Header */}
            <div className="border-b border-zinc-800 px-6 py-4 flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="text-zinc-400 hover:text-white transition-colors"
                >
                    <ChevronLeft />
                </button>
                <h1 className="text-lg font-bold flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" /> Mis Pagos
                </h1>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Mensajes */}
                {msgError && (
                    <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        <span className="text-red-400 text-sm">{msgError}</span>
                    </div>
                )}

                {msgOk && (
                    <div className="mb-6 bg-green-500/10 border border-green-500/30 rounded-2xl p-4 flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-green-400 text-sm">{msgOk}</span>
                    </div>
                )}

                {error && (
                    <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        <span className="text-red-400 text-sm">{error}</span>
                    </div>
                )}

                {/* Resumen */}
                {pagos.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        {/* Total */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                            <p className="text-zinc-500 text-xs uppercase font-bold mb-2">Total de Pagos</p>
                            <p className="text-3xl font-black text-blue-400">{resumen.total}</p>
                        </div>

                        {/* Pendientes */}
                        <div className="bg-zinc-900 border border-amber-500/30 rounded-2xl p-4">
                            <p className="text-zinc-500 text-xs uppercase font-bold mb-2">Pendientes</p>
                            <p className="text-3xl font-black text-amber-400">{resumen.pendientes}</p>
                        </div>

                        {/* Confirmados */}
                        <div className="bg-zinc-900 border border-green-500/30 rounded-2xl p-4">
                            <p className="text-zinc-500 text-xs uppercase font-bold mb-2">Confirmados</p>
                            <p className="text-3xl font-black text-green-400">{resumen.confirmados}</p>
                        </div>

                        {/* Monto Total */}
                        <div className="bg-zinc-900 border border-blue-500/30 rounded-2xl p-4">
                            <p className="text-zinc-500 text-xs uppercase font-bold mb-2">Monto Total</p>
                            <p className="text-2xl font-black text-blue-400">
                                {formatMonto(resumen.monto_total)}
                            </p>
                        </div>
                    </div>
                )}

                {/* Lista de pagos */}
                {pagos.length > 0 ? (
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold mb-4">Historial de Pagos</h2>

                        {pagos.map((pago) => (
                            <div
                                key={pago.pago_id}
                                className={`border rounded-2xl p-5 transition-all ${
                                    pago.estado === "pendiente"
                                        ? "bg-amber-500/5 border-amber-500/30"
                                        : "bg-green-500/5 border-green-500/30"
                                }`}
                            >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    {/* Información */}
                                    <div className="flex-1">
                                        <h3 className="text-white font-bold mb-1">
                                            {pago.subasta_nombre}
                                        </h3>

                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            {/* Monto */}
                                            <div>
                                                <p className="text-zinc-500 text-xs uppercase font-bold">
                                                    Monto
                                                </p>
                                                <p className="text-blue-400 font-bold">
                                                    {formatMonto(pago.monto)}
                                                </p>
                                            </div>

                                            {/* Estado */}
                                            <div>
                                                <p className="text-zinc-500 text-xs uppercase font-bold">
                                                    Estado
                                                </p>
                                                <div className="flex items-center gap-1">
                                                    {pago.estado === "pendiente" ? (
                                                        <>
                                                            <Clock className="w-3 h-3 text-amber-400" />
                                                            <span className="text-amber-400 font-bold">
                                                                Pendiente
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CheckCircle className="w-3 h-3 text-green-400" />
                                                            <span className="text-green-400 font-bold">
                                                                Confirmado
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Fecha de creación */}
                                            <div>
                                                <p className="text-zinc-500 text-xs uppercase font-bold">
                                                    Creado
                                                </p>
                                                <p className="text-zinc-400 text-xs">
                                                    {formatFecha(pago.fecha_creacion)}
                                                </p>
                                            </div>

                                            {/* Fecha de confirmación */}
                                            {pago.estado === "confirmado" && (
                                                <div>
                                                    <p className="text-zinc-500 text-xs uppercase font-bold">
                                                        Confirmado
                                                    </p>
                                                    <p className="text-green-400 text-xs">
                                                        {formatFecha(pago.fecha_confirmacion)}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Botón de confirmación */}
                                    {pago.estado === "pendiente" && (
                                        <button
                                            onClick={() => handleConfirmarPago(pago.pago_id)}
                                            disabled={confirmando === pago.pago_id}
                                            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap"
                                        >
                                            {confirmando === pago.pago_id
                                                ? "Confirmando..."
                                                : "Confirmar Pago"}
                                        </button>
                                    )}

                                    {pago.estado === "confirmado" && (
                                        <div className="flex items-center gap-2 px-6 py-3 rounded-xl bg-green-500/10 border border-green-500/30">
                                            <CheckCircle className="w-5 h-5 text-green-400" />
                                            <span className="text-green-400 font-bold">Confirmado</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-zinc-500 mb-3">No tienes pagos registrados</p>
                        <button
                            onClick={() => navigate("/subastas")}
                            className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-xl font-bold transition-all"
                        >
                            Ver Subastas
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
