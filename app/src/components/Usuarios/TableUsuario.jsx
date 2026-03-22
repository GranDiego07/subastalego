import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Edit, ToggleLeft, ToggleRight,Plus } from "lucide-react";
import UsuarioService from "@/services/UsuariosService";
import toast from "react-hot-toast";

const usuarioColumns = [
    { key: "nombre_completo", label: "Nombre" },
    { key: "correo", label: "Correo" },
    { key: "rol_nombre", label: "Rol" },
    { key: "estado_nombre", label: "Estado" },
    { key: "acciones", label: "Acciones" },
];

export default function TableUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const fetchUsuarios = async () => {
        try {
            const res = await UsuarioService.getUsuarioDetalle();
            const data = res.data?.data ?? res.data;
            setUsuarios(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleEstado = async (usuario) => {
        try {
            await UsuarioService.toggleEstado(usuario.id);

            // Actualizar localmente sin recargar toda la tabla
            setUsuarios(prev =>
                prev.map(u =>
                    u.id === usuario.id
                        ? { ...u, id_estado: u.id_estado === 1 ? 2 : 1, estado_nombre: u.id_estado === 1 ? "Inactivo" : "Activo" }
                        : u
                )
            );

            toast.success(`Usuario ${usuario.id_estado === 1 ? "desactivado" : "activado"} correctamente`);
        } catch (err) {
            toast.error("Error al cambiar el estado del usuario");
        }
    };

    if (loading) return <div className="p-10 text-center">Cargando usuarios...</div>;
    if (error) return <div className="p-10 text-center text-red-600">{error}</div>;

    return (
        <div className="container mx-auto py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Usuarios</h1>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button asChild variant="outline" size="icon" className="text-primary">
                                <Link to="/lego/usuarios/create">
                                    <Plus className="h-4 w-4" />
                                </Link>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Nueva subasta</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader className="bg-slate-100">
                        <TableRow>
                            {usuarioColumns.map((col) => (
                                <TableHead key={col.key} className="font-semibold text-black">
                                    {col.label}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {usuarios.length > 0 ? (
                            usuarios.map((usuario) => (
                                <TableRow key={usuario.id}>

                                    <TableCell className="font-medium">{usuario.nombre_completo}</TableCell>

                                    <TableCell>{usuario.correo}</TableCell>

                                    <TableCell>{usuario.rol_nombre}</TableCell>

                                    {/* Badge visual de estado */}
                                    <TableCell>
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${usuario.id_estado === 1
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                            }`}>
                                            {usuario.estado_nombre ?? (usuario.id_estado === 1 ? "Activo" : "Inactivo")}
                                        </span>
                                    </TableCell>

                                    <TableCell className="flex items-center gap-1">

                                        {/* Editar */}
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link to={`/lego/usuarios/update/${usuario.id}`}>
                                                            <Edit className="h-4 w-4 text-primary" />
                                                        </Link>
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Editar</TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>

                                        {/* Toggle estado */}
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleToggleEstado(usuario)}
                                                        className={usuario.id_estado === 1 ? "hover:bg-red-100" : "hover:bg-green-100"}
                                                    >
                                                        {usuario.id_estado === 1
                                                            ? <ToggleRight className="h-4 w-4 text-green-600" />
                                                            : <ToggleLeft className="h-4 w-4 text-red-400" />
                                                        }
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    {usuario.id_estado === 1 ? "Desactivar" : "Activar"}
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>

                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={usuarioColumns.length} className="text-center py-10 text-gray-500">
                                    No hay usuarios registrados.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}