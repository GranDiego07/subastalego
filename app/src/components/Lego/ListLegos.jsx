import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Importación necesaria
import LegoService from "../../services/LegoService";
import { LoadingGrid } from "../ui/custom/LoadingGrid";
import { EmptyState } from "../ui/custom/EmptyState";
import { ErrorAlert } from "../ui/custom/ErrorAlert";

export function ListLegos({ idShopRental = 2 }) {
    const [legos, setLegos] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Hook para navegación

    useEffect(() => {
        const fetchLegos = async () => {
            setLoading(true);
            try {
                const response = await LegoService.getByVendedor(idShopRental);
                let allLegos = response.data?.data || response.data || [];

                const uniqueLegos = allLegos.reduce((acc, lego) => {
                    if (!acc[lego.id]) {
                        acc[lego.id] = lego;
                    } else if (lego.imagen) {
                        if (!acc[lego.id].imagenes) acc[lego.id].imagenes = [];
                        acc[lego.id].imagenes.push(lego.imagen);
                    }
                    return acc;
                }, {});

                setLegos(Object.values(uniqueLegos));
            } catch (err) {
                console.error("Error al cargar legos:", err);
                setError("No se pudo conectar con el servicio de Legos.");
            } finally {
                setLoading(false);
            }
        };
        fetchLegos();
    }, [idShopRental]);

    if (loading) return <LoadingGrid type="grid" />;
    if (error) return <ErrorAlert title="Error al cargar" message={error} />;
    if (legos.length === 0) return <EmptyState message="No hay sets disponibles." />;

    return (
        <div className="mx-auto max-w-7xl p-6">
            <h2 className="text-2xl font-bold mb-6 text-white">Catálogo de Legos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {legos.map((lego) => {
                    const imagenPrincipal = Array.isArray(lego.imagenes)
                        ? lego.imagenes[0]?.url
                        : lego.imagen?.url;

                    const fullUrl = imagenPrincipal ? `${import.meta.env.VITE_BASE_URL}${imagenPrincipal}` : null;

                    return (
                        <div 
                            key={lego.id} 
                            onClick={() => navigate(`/lego/detail/${lego.id}`)} // Evento de clic
                            className="bg-white border p-4 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02]"
                        >
                            <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                                {fullUrl ? (
                                    <img src={fullUrl} alt={lego.nombre} className="object-cover w-full h-full" />
                                ) : (
                                    <span className="text-xs text-gray-400">Sin Imagen</span>
                                )}
                            </div>
                            <h3 className="font-bold text-gray-500 uppercase text-[10px] mb-1">
                                {lego.marca || 'LEGO'}
                            </h3>
                            <p className="text-lg font-semibold text-gray-900 leading-tight mb-2 h-12 overflow-hidden">
                                {lego.nombre || 'Set de Lego'}
                            </p>
                            <div className="flex justify-between items-center mt-auto">
                                <span className="text-blue-600 font-bold text-xl">
                                    ${lego.precio || '0.00'}
                                </span>
                                <span className="text-[10px] bg-blue-50 px-2 py-1 rounded text-blue-700 font-medium">
                                    {lego.categoria_nombre || 'Classic'}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}