import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Calendar, Shield,Activity, Gavel, LayoutList } from "lucide-react";
import UsuariosService from '@/services/UsuariosService';

export function DetailUsuario() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await UsuariosService.getByDetalle(id);
                // Extraemos el objeto según la estructura que devuelva tu API
                const item = response.data.data?.[0] || response.data.data || response.data;
                setUsuario(item);
            } catch (err) {
                console.error("Error al cargar detalle de usuario:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <div className="p-10 text-white text-center">Cargando perfil...</div>;
    if (!usuario) return <div className="p-10 text-white text-center">No se encontró información del usuario.</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 text-white">
            {/* ENCABEZADO */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="bg-blue-600 p-4 rounded-full">
                        <User className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold">{usuario.nombre_completo || `${usuario.nombre} ${usuario.apellido}`}</h1>
                        <p className="text-zinc-400">ID de Usuario: #{id}</p>
                    </div>
                </div>
                <Badge className={`${usuario.estado === 'activo' ? 'bg-green-600' : 'bg-red-600'} uppercase px-4 py-1`}>
                    {usuario.estado_nombre || usuario.estado}
                </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* SECCIÓN: INFORMACIÓN BÁSICA DEL PERFIL */}
                <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 space-y-4">
                    <div className="flex items-center gap-2 text-blue-500 mb-2">
                        <Shield className="w-5 h-5" />
                        <h3 className="font-bold uppercase text-sm">Información del Perfil</h3>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <span className="text-zinc-500 text-xs uppercase font-bold block">Nombre Completo</span>
                            <span className="text-white text-lg">{usuario.nombre_completo || `${usuario.nombre} ${usuario.apellido}`}</span>
                        </div>
                        <div>
                            <span className="text-zinc-500 text-xs uppercase font-bold block">Rol de Sistema</span>
                            <span className="text-blue-400 font-semibold capitalize">{usuario.rol_nombre || usuario.rol}</span>
                        </div>
                        <div>
                            <span className="text-zinc-500 text-xs uppercase font-bold block">Estado Actual</span>
                            <span className={usuario.estado === 'activo' ? 'text-green-400' : 'text-red-400'}>
                                {usuario.estado_nombre || usuario.estado}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 pt-2 border-t border-zinc-800">
                            <Calendar className="w-4 h-4 text-zinc-500" />
                            <span className="text-zinc-500 text-xs uppercase font-bold">Registro:</span>
                            <span className="text-zinc-300 text-sm">{usuario.fecha_registro || 'No disponible'}</span>
                        </div>
                    </div>
                </div>

                {/* SECCIÓN: HISTORIAL MÍNIMO (CAMPOS CALCULADOS) */}
                <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 space-y-4">
                    <div className="flex items-center gap-2 text-orange-500 mb-2">
                        <Activity className="w-5 h-5" />
                        <h3 className="font-bold uppercase text-sm">Historial de Actividad</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {/* Cantidad de subastas creadas (Si es vendedor) */}
                        <div className="bg-zinc-800/50 p-4 rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <LayoutList className="w-5 h-5 text-zinc-400" />
                                <span className="text-sm text-zinc-300">Subastas creadas</span>
                            </div>
                            <span className="text-2xl font-black text-white">
                                {usuario.cantidad_subastas || 0}
                            </span>
                        </div>

                        {/* Cantidad de pujas realizadas (Si es comprador) */}
                        <div className="bg-zinc-800/50 p-4 rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Gavel className="w-5 h-5 text-zinc-400" />
                                <span className="text-sm text-zinc-300">Pujas realizadas</span>
                            </div>
                            <span className="text-2xl font-black text-white">
                                {usuario.cantidad_pujas || 0}
                            </span>
                        </div>
                        
                        <p className="text-[10px] text-zinc-500 italic mt-2">
                            * Estos valores son calculados en tiempo real mediante consulta a la base de datos.
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <Button onClick={() => navigate(-1)} variant="outline" className="text-white border-zinc-700 hover:bg-zinc-800">
                    <ArrowLeft className="mr-2 w-4 h-4" /> Volver al listado
                </Button>
            </div>
        </div>
    );
}