import { useEffect, useState } from "react";
import LegoService from "../../services/LegoService";
import { LoadingGrid } from "../ui/custom/LoadingGrid";
import { EmptyState } from "../ui/custom/EmptyState";
import { ErrorAlert } from "../ui/custom/ErrorAlert";

// eslint-disable-next-line react/prop-types
export function ListLegos({ idShopRental = 2 }) {
    const [legos, setLegos] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLegos = async () => {
            setLoading(true);
            try {
                const response = await LegoService.getByVendedor(idShopRental);
                let allLegos = response.data?.data || response.data || [];

                // Agrupar por ID para eliminar duplicados
                const uniqueLegos = allLegos.reduce((acc, lego) => {
                    if (!acc[lego.id]) {
                        acc[lego.id] = lego;
                    } else {
                        // Si hay múltiples imágenes, agrupa en array
                        if (lego.imagen && !acc[lego.id].imagenes) {
                            acc[lego.id].imagenes = [];
                        }
                        if (lego.imagen) {
                            acc[lego.id].imagenes.push(lego.imagen);
                        }
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

    if (legos.length === 0)
        return <EmptyState message="No hay sets de Lego disponibles en esta tienda." />;

    return (
        <div className="mx-auto max-w-7xl p-6">
            <h2 className="text-2xl font-bold mb-6 text-white">Catálogo de Legos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {legos.map((lego) => {
                    // Imagen principal: toma la primera si hay array, o la única
                    const imagenPrincipal = Array.isArray(lego.imagenes)
                        ? lego.imagenes[0]?.url
                        : lego.imagen?.url;

                    const fullUrl = imagenPrincipal ? `${import.meta.env.VITE_BASE_URL}${imagenPrincipal}` : null;

                    return (
                        <div key={lego.id} className="bg-white border p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                            <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-gray-400 overflow-hidden">
                                {fullUrl ? (
                                    <img src={fullUrl} alt={lego.nombre || lego.name} className="object-cover w-full h-full" />
                                ) : (
                                    <span className="text-xs">Sin Imagen</span>
                                )}
                            </div>
                            <h3 className="font-bold text-gray-500 uppercase text-[10px] mb-1">
                                {lego.marca || 'LEGO'}
                            </h3>
                            <p className="text-lg font-semibold text-gray-900 leading-tight mb-2 h-12 overflow-hidden">
                                {lego.nombre || lego.name || 'Set de Lego'}
                            </p>
                            <div className="flex justify-between items-center mt-auto">
                                <span className="text-blue-600 font-bold text-xl">
                                    ${lego.precio || lego.price || '0.00'}
                                </span>
                                <span className="text-[10px] bg-blue-50 px-2 py-1 rounded text-blue-700 font-medium">
                                    {lego.categoria_nombre || lego.categoria || 'Classic'}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}