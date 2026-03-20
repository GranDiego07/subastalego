import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Save, ArrowLeft } from "lucide-react";
import UsuariosService from "@/services/UsuariosService";

export function UpdateUsuarios() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [usuario, setUsuario] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const usuarioSchema = yup.object({
        nombre_completo: yup
            .string()
            .required("El nombre completo es requerido")
            .min(3, "Mínimo 3 caracteres"),
        correo: yup
            .string()
            .required("El correo es requerido")
            .email("Ingrese un correo válido"),
    });

    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: { nombre_completo: "", correo: "" },
        resolver: yupResolver(usuarioSchema),
    });

    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const res = await UsuariosService.get(id);
                const data = res.data?.data ?? res.data;
                setUsuario(data);
                reset({
                    nombre_completo: data.nombre_completo,
                    correo: data.correo,
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchUsuario();
    }, [id, reset]);

    const onSubmit = async (dataForm) => {
        try {
            const payload = { id, ...dataForm };
            const response = await UsuariosService.update(payload);
            if (response.data) {
                toast.success("Usuario actualizado correctamente", { duration: 4000 });
                navigate("/lego/usuarios");
            }
        } catch (err) {
            console.error(err);
            toast.error("Error al actualizar el usuario");
        }
    };

    if (loading) return <p className="p-10 text-center">Cargando usuario...</p>;
    if (error) return <p className="text-red-600 p-4">{error}</p>;

    return (
        <Card className="p-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Editar Usuario</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                {/* Nombre Completo */}
                <div>
                    <Label className="block mb-1 text-sm font-medium" htmlFor="nombre_completo">Nombre Completo</Label>
                    <Controller name="nombre_completo" control={control} render={({ field }) => (
                        <Input {...field} id="nombre_completo" placeholder="Nombre completo" />
                    )} />
                    {errors.nombre_completo && <p className="text-sm text-red-500">{errors.nombre_completo.message}</p>}
                </div>

                {/* Correo */}
                <div>
                    <Label className="block mb-1 text-sm font-medium" htmlFor="correo">Correo</Label>
                    <Controller name="correo" control={control} render={({ field }) => (
                        <Input {...field} id="correo" type="email" placeholder="correo@ejemplo.com" />
                    )} />
                    {errors.correo && <p className="text-sm text-red-500">{errors.correo.message}</p>}
                </div>

                {/* Campos NO editables: Rol y Fecha Registro */}
                {usuario && (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="block mb-1 text-sm font-medium">Rol</Label>
                            <Input value={usuario.rol_nombre ?? usuario.id_rol ?? "—"} disabled className="bg-muted text-muted-foreground" />
                        </div>
                        <div>
                            <Label className="block mb-1 text-sm font-medium">Fecha de Registro</Label>
                            <Input value={usuario.fecha_registro ? new Date(usuario.fecha_registro).toLocaleString("es-CR") : "—"} disabled className="bg-muted text-muted-foreground" />
                        </div>
                    </div>
                )}

                {/* Botones */}
                <div className="flex justify-between gap-4 mt-6">
                    <Button type="button" variant="default" className="flex items-center gap-2 bg-accent text-white" onClick={() => navigate(-1)}>
                        <ArrowLeft className="w-4 h-4" /> Regresar
                    </Button>
                    <Button type="submit" className="flex-1 flex items-center justify-center gap-2">
                        <Save className="w-4 h-4" /> Guardar
                    </Button>
                </div>

            </form>
        </Card>
    );
}