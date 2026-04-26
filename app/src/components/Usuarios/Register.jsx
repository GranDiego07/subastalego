import { useState } from "react";
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
    const [open, setOpen] = useState(false);
    const [rolId, setRolId] = useState(1);

    const options = [
        { value: 1, label: "Comprador" },
        { value: 2, label: "Vendedor" },
    ];

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            rol_id: 1,
        },
        resolver: yupResolver(schema)
    });

    const onSubmit = async (data) => {
        try {
            const payload = {
                nombre_completo: data.name,
                correo: data.email,
                contrasena: data.password,
                id_rol: Number(rolId),
                id_estado: '1',
                fecha_registro: new Date().toISOString().split('T')[0],
            };
            console.log("Datos enviados:", payload);
            const response = await UsuariosService.create(payload);
            if (response?.success) {
                toast.success("Usuario creado correctamente");
                reset(),
                    setRolId(1),
                    setValue("rol_id", 1)
                navigate("/login");
            } else {
                if (response?.message?.includes("Duplicate entry")) {
                    toast.error("Este correo ya está registrado");
                } else {
                    toast.error("No se pudo crear el usuario");

                }
            }
        }
        catch (error) {
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
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setOpen(!open)}
                                    className="w-full rounded-md bg-white/20 border border-white/30 text-white p-2 text-left flex justify-between items-center"
                                >
                                    {options.find(o => o.value === rolId)?.label}
                                    <span>▾</span>
                                </button>

                                {open && (
                                    <ul className="absolute z-10 w-full mt-1 bg-black border border-white/30 rounded-md overflow-hidden">
                                        {options.map(option => (
                                            <li
                                                key={option.value}
                                                onClick={() => {
                                                    setRolId(option.value);
                                                    setValue("rol_id", option.value);
                                                    setOpen(false);
                                                }}
                                                className="px-3 py-2 text-white hover:bg-white/20 cursor-pointer"
                                            >
                                                {option.label}
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                <input type="hidden" {...register("rol_id")} value={rolId} />
                            </div>
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
                            <a href="/login" className="text-accent underline hover:text-accent/80">
                                Inicia sesión
                            </a>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}