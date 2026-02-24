import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
import { Edit, Plus, Trash2, ArrowLeft } from "lucide-react";
import UsuariosService from "@/services/UsuariosService";

// Columnas de la tabla
const userColumns = [
    { key: "id", label: "ID" },
    { key: "nombre_completo", label: "Nombre" },
    { key: "correo", label: "Correo electrónico" },
    { key: "rol_nombre", label: "Rol" },
    { key: "estado_nombre", label: "Estado" },
    { key: "acciones", label: "Acciones" },
];

export default function TableUsers() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("Cargando usuarios con getUsuarioDetalle()...");

                // ✅ Obtener todos los usuarios con información COMPLETA

                // En fetchData:
                const response = await UsuariosService.getUsuarioDetalle();
                let data = response.data;

                // Si PHP lo devolvió como texto (por espacios en blanco o BOM), forzar el parseo
                if (typeof data === 'string') {
                    try {
                        data = JSON.parse(data.trim());
                    } catch (e) {
                        console.error("El servidor no devolvió un JSON válido:", data);
                    }
                }

                let dataArray = [];

                // Buscar el arreglo en las estructuras más comunes
                if (Array.isArray(data)) {
                    dataArray = data; // Arreglo directo
                } else if (data && Array.isArray(data.data)) {
                    dataArray = data.data; // Envuelto en { data: [...] }
                } else if (data && Array.isArray(data.result)) {
                    dataArray = data.result; // Envuelto en { result: [...] }
                } else if (data && typeof data === 'object' && Object.keys(data).length > 0) {
                    dataArray = [data]; // Objeto único
                } else {
                    console.warn("Formato inesperado del backend:", data);
                }

                setUsers(dataArray);
            } catch (err) {
                console.error("Error al cargar usuarios:", err);
                setError(err.message || "Error al conectar con el servidor");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="p-10 text-center text-white mt-16">⏳ Cargando usuarios...</div>;
    }

    if (error) {
        return <div className="p-10 text-center text-red-600 mt-16">⚠️ {error}</div>;
    }

    return (
        <div className="container mx-auto py-8 mt-12">
            {/* Header con título y botón agregar */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold tracking-tight text-white">
                    Lista de Usuarios
                </h1>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                asChild
                                variant="outline"
                                size="icon"
                                className="text-primary hover:bg-primary/20"
                            >
                                <Link to="/lego/usuarios/create">
                                    <Plus className="h-4 w-4" />
                                </Link>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Agregar nuevo usuario</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            {/* Tabla de usuarios */}
            <div className="rounded-md border border-gray-700 bg-gray-900 overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-800 border-b border-gray-700">
                        <TableRow>
                            {userColumns.map((col) => (
                                <TableHead
                                    key={col.key}
                                    className="font-semibold text-gray-200 py-3"
                                >
                                    {col.label}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.length > 0 ? (
                            users.map((user, index) => (
                                <TableRow
                                    key={index}
                                    className="border-gray-700 hover:bg-gray-800 transition"
                                >
                                    {/* ID - Generado del índice ya que PHP no retorna ID */}
                                    <TableCell className="text-gray-300 font-medium">
                                        {index + 1}
                                    </TableCell>

                                    {/* Nombre Completo */}
                                    <TableCell className="font-semibold text-white">
                                        {user.nombre_completo || user.nombre || "—"}
                                    </TableCell>

                                    {/* Correo */}
                                    <TableCell className="text-gray-300">
                                        {user.correo || user.email || "—"}
                                    </TableCell>

                                    {/* Rol */}
                                    <TableCell className="text-gray-300">
                                        {user.rol_nombre || user.nombre_rol || user.rol || "—"}
                                    </TableCell>

                                    {/* Estado */}
                                    <TableCell className="text-gray-300">
                                        {user.estado_nombre || user.nombre_estado || user.estado || "—"}
                                    </TableCell>

                                    {/* Acciones */}
                                    <TableCell className="flex justify-start items-center gap-2">
                                        {/* Botón Editar */}
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        asChild
                                                        className="hover:bg-primary/20"
                                                    >
                                                        <Link to={`/lego/usuarios/edit/${index + 1}`}>
                                                            <Edit className="h-4 w-4 text-blue-400" />
                                                        </Link>
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Editar usuario</TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>

                                        {/* Botón Eliminar */}
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="hover:bg-red-500/20"
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-400" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Eliminar usuario</TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={userColumns.length}
                                    className="text-center py-10 text-gray-500"
                                >
                                    📭 No hay usuarios registrados.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Botón Regresar */}
            <Button
                asChild
                className="flex items-center gap-2 bg-slate-800 text-white hover:bg-slate-700 mt-6"
            >
                <Link to="/lego">
                    <ArrowLeft className="w-4 h-4" />
                    Regresar
                </Link>
            </Button>
        </div>
    );
}