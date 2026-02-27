import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SubastaService from "../../services/SubastaService";
import { LoadingGrid } from "../ui/custom/LoadingGrid";
import { ErrorAlert } from "../ui/custom/ErrorAlert";

export function DetailSubasta() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [subasta, setSubasta] = useState(null);
    const [historial, setHistorial] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingHistorial, setLoadingHistorial] = useState(true);
    const [error, setError] = useState(null);

    console.log("ID recibido en DetailSubasta:", id);

    useEffect(() => {
        if (!id) {
            setError("No se recibió ID de subasta");
            setLoading(false);
            return;
        }

        const fetchDetalle = async () => {
            try {
                const response = await SubastaService.getDetalleSubasta(id);

                let detalle = null;

                if (response.data?.success === true && Array.isArray(response.data?.data) && response.data.data.length > 0) {
                    detalle = response.data.data[0];
                } else if (Array.isArray(response.data) && response.data.length > 0) {
                    detalle = response.data[0];
                } else if (response.data && response.data.subasta_id) {
                    detalle = response.data;
                }

                if (!detalle) {
                    throw new Error("No se encontraron datos válidos");
                }

                setSubasta(detalle);
            } catch (err) {
                console.error("Error al cargar detalle:", err);
                setError(err.response?.data?.message || "No se pudo cargar la subasta");
            } finally {
                setLoading(false);
            }
        };

        const fetchHistorial = async () => {
            try {
                const response = await SubastaService.getHistorialPujas(id);

                console.log("HISTORIAL - Respuesta raw:", response);
                console.log("HISTORIAL - response.data:", response.data);
                console.log("HISTORIAL - ¿Existe data array?", Array.isArray(response.data?.data));
                console.log("HISTORIAL - Longitud data:", response.data?.data?.length);
                console.log("HISTORIAL - Primer elemento:", response.data?.data?.[0]);

                let pujas = [];
                if (response.data?.success && Array.isArray(response.data.data)) {
                    pujas = response.data.data;
                } else if (Array.isArray(response.data)) {
                    pujas = response.data;
                } else if (response.data?.data) {
                    pujas = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
                }

                console.log("HISTORIAL - Pujas finales después de parseo:", pujas);
                console.log("HISTORIAL - Cantidad final:", pujas.length);

                setHistorial(pujas);
            } catch (err) {
                console.error("HISTORIAL - Error:", err);
            } finally {
                setLoadingHistorial(false);
            }
        };

        fetchDetalle();
        fetchHistorial();
    }, [id]);

    if (loading) return <LoadingGrid />;

    if (error) return <ErrorAlert title="Error" message={error} />;

    if (!subasta) {
        return (
            <div className="text-center text-white p-10">
                No se encontró la subasta con ID: {id}
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-6 text-white bg-zinc-950 rounded-xl shadow-2xl border border-zinc-800">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-blue-400">
                {subasta.Lego || subasta.nombre_lego || "Subasta sin nombre"}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                    <p className="text-lg text-zinc-300">
                        <span className="font-semibold text-white">Precio base:</span>{" "}
                        ${subasta.Precio || subasta.precio_base || "—"}
                    </p>
                </div>

                <div>
                    <p className="text-lg text-zinc-300">
                        <span className="font-semibold text-white">Fecha de cierre:</span>{" "}
                        {subasta.fecha_cierre || "No especificada"}
                    </p>
                </div>

                {subasta.estado_final && (
                    <div>
                        <p className="text-lg text-zinc-300">
                            <span className="font-semibold text-white">Estado:</span>{" "}
                            {subasta.estado_final}
                        </p>
                    </div>
                )}

                {subasta.cantidad_pujas !== undefined && (
                    <div>
                        <p className="text-lg text-zinc-300">
                            <span className="font-semibold text-white">Pujas recibidas:</span>{" "}
                            {subasta.cantidad_pujas}
                        </p>
                    </div>
                )}
            </div>

            {subasta.imagen && (
                <div className="mb-8">
                    <img
                        src={`${import.meta.env.VITE_BASE_URL}${subasta.imagen}`}
                        alt={subasta.Lego || "Imagen de la subasta"}
                        className="max-w-full h-auto rounded-lg shadow-lg border border-zinc-700 mx-auto"
                        onError={(e) => (e.target.src = "/placeholder-lego.png")}
                    />
                </div>
            )}

            {/* ────────────────────────────────────────────────
                 HISTORIAL DE PUJAS
            ──────────────────────────────────────────────── */}
            <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6 text-blue-400 flex items-center gap-3">
                    <span>Historial de Pujas</span>
                    <span className="text-sm bg-zinc-800 px-3 py-1 rounded-full">
                        {historial.length} {historial.length === 1 ? "puja" : "pujas"}
                    </span>
                </h2>

                {loadingHistorial ? (
                    <LoadingGrid />
                ) : historial.length === 0 ? (
                    <div className="bg-zinc-900 p-8 rounded-xl text-center text-zinc-400 border border-zinc-800">
                        <p className="text-lg">Aún no hay pujas para esta subasta.</p>
                        <p className="mt-2 text-sm">¡Sé el primero en ofertar!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {historial.map((puja) => (
                            <div
                                key={puja.puja_id || puja.id}
                                className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl hover:border-blue-600/50 transition-all"
                            >
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                                    <div>
                                        <p className="font-semibold text-white text-lg">
                                            {puja.usuario_pujador || "Usuario"}
                                        </p>
                                        <p className="text-blue-400 text-2xl font-bold mt-1">
                                            ${Number(puja.monto).toLocaleString('es-CR')}
                                        </p>
                                    </div>
                                    <p className="text-sm text-zinc-400 whitespace-nowrap">
                                        {new Date(puja.fecha_hora).toLocaleString('es-CR', {
                                            dateStyle: 'medium',
                                            timeStyle: 'short'
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <button
                onClick={() => navigate(-1)}
                className="mt-10 px-6 py-3 bg-zinc-700 hover:bg-zinc-600 text-white font-medium rounded-lg transition-colors"
            >
                ← Volver
            </button>
        </div>
    );
}   