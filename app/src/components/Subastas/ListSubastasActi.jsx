import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SubastaService from "../../services/SubastaService";
import { LoadingGrid } from "../ui/custom/LoadingGrid";
import { EmptyState } from "../ui/custom/EmptyState";
import { ErrorAlert } from "../ui/custom/ErrorAlert";
import { Badge } from "@/components/ui/badge";
import { Gavel, Calendar, ArrowRight } from "lucide-react";

export function ListSubastasActi() {
    const [subastas, setSubastas] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const BASE_URL = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
        const fetchSubasta = async () => {
            setLoading(true);
            try {
                const response = await SubastaService.getSubastaActiva();
                const data = response.data?.data || response.data || [];
                setSubastas(data);
            } catch (err) {
                console.error("No hay subastas activas en este momento", err);
                setError("");
            } finally {
                setLoading(false);
            }
        };
        fetchSubasta();
    }, []);

    if (loading) return <LoadingGrid type="grid" />;
    if (error) return <ErrorAlert title="No hay subastas activas en este momento" message={error} />;
    if (subastas.length === 0) return <EmptyState message="No hay subastas activas en este momento." />;

    return (
        <div className="mx-auto max-w-7xl p-6">
            <h2 className="text-3xl font-extrabold mb-8 text-white flex items-center gap-3">
                <Gavel className="text-blue-500" /> Catálogo de Subastas Activas
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {subastas.map((item, index) => {
                    const fullUrl = item.imagen ? `${BASE_URL}${item.imagen}` : null;
                    
                    // Intentamos obtener el valor de la puja de cualquiera de los dos nombres posibles
                    const valorPuja = item.Precio || item.UltimaPuja;

                    return (
                        <div
                            key={index}
                            className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl overflow-hidden flex flex-col"
                        >
                            {/* ── Imagen ── */}
                            <div className="aspect-[4/3] bg-white flex items-center justify-center overflow-hidden relative">
                                {fullUrl ? (
                                    <img
                                        src={fullUrl}
                                        alt={item.Lego}
                                        className="object-contain w-full h-full p-4"
                                    />
                                ) : (
                                    <span className="text-xs text-gray-400">Sin Imagen</span>
                                )}
                                <Badge className="absolute top-3 right-3 bg-green-600">Activa</Badge>
                            </div>

                            {/* ── Info ── */}
                            <div className="p-5 space-y-3 flex flex-col flex-1">
                                <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 h-14">
                                    {item.Lego}
                                </h3>

                                <div className="space-y-2 text-zinc-400 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-blue-500" />
                                        <span>Cierra: {item.fecha_cierre}</span>
                                    </div>
                                </div>

                                <div className="pt-2 flex justify-between items-end">
                                    {/* Cambiamos la lógica: Si hay pujas Y tenemos un valor, lo mostramos */}
                                    {item.cantidad_pujas > 0 && valorPuja ? (
                                        <span className="text-2xl font-black text-blue-400">
                                            ${valorPuja}
                                        </span>
                                    ) : (
                                        <span className="text-sm font-medium text-zinc-500 italic">
                                            Sin pujas
                                        </span>
                                    )}
                                    
                                    <span className="text-xs text-zinc-500">
                                        {item.cantidad_pujas} puja{item.cantidad_pujas !== 1 ? "s" : ""}
                                    </span>
                                </div>

                                {/* ── Botón Ver Subasta ── */}
                                <button
                                    onClick={() => navigate(`/subasta/detalle/${item.subasta_id}`)}
                                    className="mt-auto w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors duration-200"
                                >
                                    Ver subasta y pujar
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}