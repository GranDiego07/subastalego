import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Importar useNavigate
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Edit, Plus, Trash2, ArrowLeft, UserCircle } from "lucide-react";
import UsuariosService from "@/services/UsuariosService";

const userColumns = [
    { key: "nombre_completo", label: "Nombre Completo" },
    { key: "rol", label: "Rol" },
    { key: "estado", label: "Estado" },
    { key: "acciones", label: "Acciones" },
];

export default function TableUsers() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Hook para redireccionar

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await UsuariosService.getUsuarioDetalle();
                let data = response.data?.data || response.data || [];
                setUsers(Array.isArray(data) ? data : [data]);
            } catch (err) {
                console.error("Error al cargar usuarios:", err);
                setError("Error al conectar con el servidor");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Función para manejar el clic en la fila
    const handleRowClick = (id) => {
        navigate(`/lego/usuarios/detail/${id}`); 
    };

    if (loading) {
        return <div className="p-10 text-center text-white mt-16">⏳ Cargando listado de usuarios...</div>;
    }

    if (error) {
        return <div className="p-10 text-center text-red-600 mt-16">⚠️ {error}</div>;
    }

    return (
        <div className="container mx-auto py-8 mt-12">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold tracking-tight text-white">
                    Gestión de Usuarios
                </h1>
                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                    <Link to="/lego/usuarios/create">
                        <Plus className="h-4 w-4" /> Nuevo Usuario
                    </Link>
                </Button>
            </div>

            <div className="rounded-md border border-gray-700 bg-gray-900 overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-800">
                        <TableRow className="hover:bg-transparent border-gray-700">
                            {userColumns.map((col) => (
                                <TableHead key={col.key} className="text-gray-200 font-bold py-4">
                                    {col.label}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.length > 0 ? (
                            users.map((user) => (
                                <TableRow 
                                    key={user.id} 
                                    // Evento de clic en la fila
                                    onClick={() => handleRowClick(user.id)}
                                    className="border-gray-700 hover:bg-gray-800/50 transition cursor-pointer"
                                >
                                    {/* 1. Nombre Completo */}
                                    <TableCell className="text-white font-medium py-4">
                                        <div className="flex items-center gap-3">
                                            <UserCircle className="w-5 h-5 text-gray-400" />
                                            {user.nombre_completo || `${user.nombre} ${user.apellido}`}
                                        </div>
                                    </TableCell>

                                    {/* 2. Rol */}
                                    <TableCell>
                                        <span className="px-2 py-1 rounded-md bg-blue-900/30 text-blue-300 text-xs font-semibold uppercase border border-blue-800">
                                            {user.rol_nombre || user.rol || "Usuario"}
                                        </span>
                                    </TableCell>

                                    {/* 3. Estado */}
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className={`h-2 w-2 rounded-full ${
                                                user.estado === 'activo' || user.estado_nombre === 'activo' 
                                                ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' 
                                                : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'
                                            }`} />
                                            <span className={`text-sm font-medium ${
                                                user.estado === 'activo' || user.estado_nombre === 'activo' 
                                                ? 'text-green-400' 
                                                : 'text-red-400'
                                            }`}>
                                                {user.estado_nombre || user.estado || "Desconocido"}
                                            </span>
                                        </div>
                                    </TableCell>

                                    {/* Acciones */}
                                    <TableCell onClick={(e) => e.stopPropagation()}>
                                        <div className="flex items-center gap-2">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button variant="ghost" size="icon" asChild className="hover:bg-blue-500/20">
                                                            <Link to={`/lego/usuarios/edit/${user.id}`}>
                                                                <Edit className="h-4 w-4 text-blue-400" />
                                                            </Link>
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Editar</TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="hover:bg-red-500/20">
                                                            <Trash2 className="h-4 w-4 text-red-400" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Eliminar</TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={userColumns.length} className="text-center py-12 text-gray-500">
                                    No se encontraron usuarios en el sistema.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <Button asChild variant="ghost" className="text-gray-400 hover:text-white mt-6 gap-2">
                <Link to="/lego">
                    <ArrowLeft className="w-4 h-4" /> Regresar al inicio
                </Link>
            </Button>
        </div>
    );
}