import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LegoService from '../../services/LegoService';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info } from "lucide-react";

export function DetailLego() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [lego, setData] = useState(null);
    const [imagesList, setImagesList] = useState([]);
    const [mainImage, setMainImage] = useState(null);
    const [loading, setLoading] = useState(true);

    const BASE_URL = import.meta.env.VITE_BASE_URL;

    // Función de seguridad para extraer texto de objetos y evitar el error "Objects are not valid"
    const formatValue = (value, property = 'nombre') => {
        if (!value) return "";
        if (typeof value === 'object') return value[property] || "";
        return String(value);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await LegoService.getByDetalle(id);
                // Extraemos el objeto de la respuesta
                const item = response.data.data?.[0] || response.data.data || response.data;
                
                setData(item);

                // Procesamos las imágenes relacionadas
                if (item.imagenes_urls) {
                    const urls = item.imagenes_urls.split(',');
                    setImagesList(urls);
                    setMainImage(urls[0]);
                }
            } catch (err) {
                console.error("Error al cargar:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <div className="p-10 text-white text-center">Cargando...</div>;
    if (!lego) return <div className="p-10 text-white text-center">No se encontró información.</div>;

    return (
        <div className="max-w-6xl mx-auto p-6 text-white">
            <div className="flex flex-col md:flex-row gap-10">

                {/* GALERÍA */}
                <div className="w-full md:w-1/2 space-y-4">
                    <div className="bg-white p-4 rounded-xl aspect-square flex items-center justify-center border border-zinc-800 shadow-2xl">
                        {mainImage ? (
                            <img src={`${BASE_URL}${mainImage}`} className="w-full h-full object-contain" alt="Principal" />
                        ) : (
                            <div className="text-zinc-400">Sin imagen</div>
                        )}
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                        {imagesList.map((url, index) => (
                            <div key={index} onClick={() => setMainImage(url)}
                                className={`cursor-pointer bg-white p-2 rounded-lg border-2 transition-all aspect-square flex items-center justify-center ${
                                    mainImage === url ? 'border-blue-500 scale-95' : 'border-transparent'
                                }`}>
                                <img src={`${BASE_URL}${url}`} className="max-h-full object-contain" alt="Miniatura" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* INFORMACIÓN */}
                <div className="flex-1 space-y-6">
                    <div>
                        <Badge className="bg-blue-600 mb-2 uppercase text-[10px] px-3 py-1">
                            {formatValue(lego.categoria)} 
                        </Badge>
                        <h1 className="text-4xl font-extrabold">{formatValue(lego.nombre)}</h1>
                    </div>

                    <div className="grid grid-cols-2 gap-6 bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
                        <div>
                            <span className="text-zinc-500 text-xs uppercase font-bold block mb-1">Vendedor</span>
                            <span className="text-blue-400 font-bold text-lg">
                                {formatValue(lego.vendedor)}
                            </span>
                        </div>
                        <div>
                            <span className="text-zinc-500 text-xs uppercase font-bold block mb-1">Estado</span>
                            <span className="text-white font-semibold text-lg">
                                {formatValue(lego.estado)}
                            </span>
                        </div>
                    </div>

                    <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 space-y-4">
                        <div className="flex items-center gap-2 text-blue-500">
                            <Info className="w-5 h-5" />
                            <h3 className="font-bold uppercase text-sm">Detalles del Set</h3>
                        </div>

                        <div className="bg-blue-500/10 border-l-4 border-blue-500 p-4">
                            <span className="text-blue-400 text-xs font-black uppercase block mb-1">Condición:</span>
                            <p className="text-white italic text-base">
                                &quot;{formatValue(lego.condicion)}&quot;
                            </p>
                        </div>

                        <div>
                            <span className="text-zinc-500 text-xs font-bold uppercase block mb-2">Descripción:</span>
                            <p className="text-zinc-300 text-sm">{formatValue(lego.descripcion)}</p>
                        </div>
                    </div>

                    <Button onClick={() => navigate(-1)} variant="outline" className="text-white border-zinc-700 hover:bg-zinc-800">
                        <ArrowLeft className="mr-2 w-4 h-4" /> Volver al catálogo
                    </Button>
                </div>
            </div>
        </div>
    );
}