import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, AlertTriangle, CheckCircle, Clock, TrendingUp, PackageOpen } from "lucide-react";
import PagoService from "@/services/PagoService";
import { useUser } from "@/hooks/useUser";

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
    const navigate   = useNavigate();
    const { user }   = useUser();

    const [pagos,       setPagos]       = useState([]);
    const [loading,     setLoading]     = useState(true);
    const [error,       setError]       = useState("");
    const [confirmando, setConfirmando] = useState(null);
    const [msgOk,       setMsgOk]       = useState("");
    const [msgError,    setMsgError]    = useState("");

    // ── Cargar pagos PENDIENTES del usuario logueado ──────────────────────
    const cargarPagos = async () => {
        if (!user?.id) return;
        try {
            setLoading(true);
            setError("");
            const response = await PagoService.getPorUsuario(user.id);
            setPagos(response.data?.data?.data || []);
        } catch (err) {
            console.error("Error al cargar pagos:", err);
            setError(err.response?.data?.error || "Error al cargar los pagos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarPagos();
    }, [user?.id]);

    // ── Confirmar un pago ─────────────────────────────────────────────────
    const handleConfirmarPago = async (pago_id) => {
        try {
            setMsgError("");
            setMsgOk("");
            setConfirmando(pago_id);

            await PagoService.confirmar(pago_id, user.id);

            // Quitar el pago de la lista (ya no está pendiente)
            setPagos(prev => prev.filter(p => p.pago_id !== pago_id));
            setMsgOk("¡Pago confirmado correctamente!");
            setTimeout(() => setMsgOk(""), 3000);

        } catch (err) {
            setMsgError(err.response?.data?.error || err.response?.data?.message || "Error al confirmar pago");
            console.error("Error:", err);
        } finally {
            setConfirmando(null);
        }
    };

    // ── Loading ───────────────────────────────────────────────────────────
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
                    <TrendingUp className="w-5 h-5 text-amber-400" />
                    Mis Pagos Pendientes
                </h1>
                {/* Nombre del usuario logueado */}
                <span className="ml-auto text-xs text-zinc-500">
                    {user?.nombre_completo ?? user?.nombre ?? ""}
                </span>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-8">

                {/* Mensajes de feedback */}
                {msgError && (
                    <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                        <span className="text-red-400 text-sm">{msgError}</span>
                    </div>
                )}

                {msgOk && (
                    <div className="mb-6 bg-green-500/10 border border-green-500/30 rounded-2xl p-4 flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                        <span className="text-green-400 text-sm">{msgOk}</span>
                    </div>
                )}

                {error && (
                    <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                        <span className="text-red-400 text-sm">{error}</span>
                    </div>
                )}

                {/* Resumen contador */}
                {pagos.length > 0 && (
                    <div className="mb-6 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-center gap-3">
                        <Clock className="w-5 h-5 text-amber-400 shrink-0" />
                        <span className="text-amber-300 text-sm font-medium">
                            Tienes <span className="font-bold text-amber-400">{pagos.length}</span>{" "}
                            {pagos.length === 1 ? "pago pendiente" : "pagos pendientes"} por confirmar.
                        </span>
                    </div>
                )}

                {/* Lista de pagos pendientes */}
                {pagos.length > 0 ? (
                    <div className="space-y-4">
                        {pagos.map((pago) => (
                            <div
                                key={pago.pago_id}
                                className="bg-amber-500/5 border border-amber-500/30 rounded-2xl p-5"
                            >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                                    {/* Info del pago */}
                                    <div className="flex-1 space-y-2">
                                        <h3 className="text-white font-bold text-base">
                                            {pago.subasta_nombre || `Subasta #${pago.id_subasta}`}
                                        </h3>

                                        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                                            <div>
                                                <p className="text-zinc-500 text-xs uppercase font-bold mb-0.5">Monto</p>
                                                <p className="text-blue-400 font-bold text-base">{formatMonto(pago.monto)}</p>
                                            </div>
                                            <div>
                                                <p className="text-zinc-500 text-xs uppercase font-bold mb-0.5">Estado</p>
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                                                    <span className="text-amber-400 font-bold">Pendiente</span>
                                                </div>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-zinc-500 text-xs uppercase font-bold mb-0.5">Fecha de pago registrada</p>
                                                <p className="text-zinc-400 text-xs">{formatFecha(pago.fecha_creacion)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Botón confirmar */}
                                    <button
                                        onClick={() => handleConfirmarPago(pago.pago_id)}
                                        disabled={confirmando === pago.pago_id}
                                        className="bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap flex items-center gap-2"
                                    >
                                        {confirmando === pago.pago_id ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Confirmando...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="w-4 h-4" />
                                                Confirmar Pago
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Sin pagos pendientes */
                    <div className="text-center py-16 space-y-4">
                        <div className="flex justify-center">
                            <PackageOpen className="w-14 h-14 text-zinc-700" />
                        </div>
                        <p className="text-zinc-400 font-medium">No tienes pagos pendientes</p>
                        <p className="text-zinc-600 text-sm">
                            Cuando ganes una subasta, tu pago aparecerá aquí para confirmarlo.
                        </p>
                        <button
                            onClick={() => navigate("/")}
                            className="mt-4 bg-blue-600 hover:bg-blue-500 px-6 py-2.5 rounded-xl font-bold text-sm transition-all"
                        >
                            Ver Subastas
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}