import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SubastaService from "../../services/SubastaService";
import { LoadingGrid } from "../ui/custom/LoadingGrid";
import { ErrorAlert } from "../ui/custom/ErrorAlert";

export function DetailSubasta() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [subasta, setSubasta] = useState(null);
    const [loading, setLoading] = useState(true);
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

                console.log("📡 Respuesta completa:", response);
                console.log("📦 response.data:", response.data);

                let detalle = null;

                // Estructura real de tu backend: { success, status, message, data: [objeto] }
                if (response.data?.success === true && Array.isArray(response.data?.data) && response.data.data.length > 0) {
                    detalle = response.data.data[0];  // ← Aquí está el objeto real
                } else if (Array.isArray(response.data) && response.data.length > 0) {
                    detalle = response.data[0];
                } else if (response.data && response.data.subasta_id) {
                    detalle = response.data;
                }

                if (!detalle) {
                    throw new Error("No se encontraron datos válidos en la respuesta");
                }

                console.log("✅ Detalle extraído:", detalle);
                setSubasta(detalle);
            } catch (err) {
                console.error("❌ Error al cargar:", err);
                setError(
                    err.response?.data?.message ||
                    "No se pudo cargar la subasta. Verifica la consola para más detalles."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDetalle();
    }, [id]);

    // ────────────────────────────────────────────────
    //               Renderizado
    // ────────────────────────────────────────────────

    if (loading) {
        return <LoadingGrid />;
    }

    if (error) {
        return <ErrorAlert title="Error" message={error} />;
    }

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
                        className="max-w-full h-auto rounded-lg shadow-lg border border-zinc-700"
                        onError={(e) => {
                            e.target.src = "/placeholder-lego.png"; // imagen de fallback si quieres
                            e.target.alt = "Imagen no disponible";
                        }}
                    />
                </div>
            )}

            <button
                onClick={() => navigate(-1)}
                className="px-6 py-3 bg-zinc-700 hover:bg-zinc-600 text-white font-medium rounded-lg transition-colors"
            >
                ← Volver
            </button>
        </div>
    );
}