import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import UsuariosService from "@/services/UsuariosService";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = yup.object({
    name: yup.string().required("El nombre es obligatorio"),
    email: yup.string().email("Correo inválido").required("El correo es obligatorio"),
    password: yup.string().min(6, "Mínimo 6 caracteres").required("La contraseña es obligatoria"),
    rol_id: yup.number().required('El rol es requerido'),
});

export default function Register() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        // Valores iniciales
        defaultValues: {
            name: '',
            email: '',
            password: '',
            rol_id: '',
        },
        resolver: yupResolver(schema)
    });

    const onSubmit = async (data) => {
        try {
            const response = await UsuariosService.create(data);
            if (response?.success) {
                toast.success("Usuario creado correctamente");
                navigate("/user/login");
            } else {
                toast.error("No se pudo crear el usuario");
            }
        } catch (error) {
            toast.error("Error al crear usuario");
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card className="w-full max-w-md shadow-lg border border-white/10 bg-white/10 backdrop-blur-lg text-white">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold">Crear Cuenta</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div>
                            <Label htmlFor="name">Nombre</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Tu nombre"
                                {...register("name")}
                                className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                            />
                            {errors.name && <p className="text-red-300 text-sm mt-1">{errors.name.message}</p>}
                        </div>

                        <div>
                            <Label htmlFor="email">Correo electrónico</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="ejemplo@correo.com"
                                {...register("email")}
                                className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                            />
                            {errors.email && <p className="text-red-300 text-sm mt-1">{errors.email.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="rol_id">Tipo de cuenta</Label>
                            <select
                                id="rol_id"
                                {...register("rol_id", { valueAsNumber: true })}
                                className="w-full rounded-md bg-white/20 border border-white/30 text-white p-2"
                            >
                                <option value={1}>Comprador</option>
                                <option value={2}>Vendedor</option>
                            </select>
                            {errors.rol_id && <p className="text-red-300 text-sm mt-1">{errors.rol_id.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="password">Contraseña</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="********"
                                {...register("password")}
                                className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                            />
                            {errors.password && (
                                <p className="text-red-300 text-sm mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-secondary hover:bg-secondary/90 text-white font-semibold mt-2"
                        >
                            {isSubmitting ? "Creando..." : "Crear cuenta"}
                        </Button>

                        <p className="text-sm text-center mt-4">
                            ¿Ya tienes cuenta?{" "}
                            <a href="/user/login" className="text-accent underline hover:text-accent/80">
                                Inicia sesión
                            </a>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
