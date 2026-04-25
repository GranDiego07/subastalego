import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast"; // ← agregar Toaster
import { useUser } from "@/hooks/useUser";
import UsuariosService from "@/services/UsuariosService";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CustomInputField } from "../ui/custom/custom-input-field";

const schema = yup.object({
    correo: yup.string().email("Correo invalido").required("El correo es obligatorio"),
    contrasena: yup.string().required("La contraseña es obligatoria"),
})

export default function Login() {
    const { saveUser } = useUser();
    const navigate = useNavigate();
    const {
        register, handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: yupResolver(schema) });

    const onSubmit = async (data) => {
        try {
            const response = await UsuariosService.loginUser(data);
            const result = response.data;

            if (result?.data?.error) {
                toast.error(result.data.message);
                return;
            }

            if (result?.data) {
                saveUser(result.data);
                toast.success("Inicio de sesión exitoso");
                navigate("/");
            } else {
                toast.error("Credenciales inválidas");
            }

        } catch (error) {
            const serverMessage = error.response?.data?.message || "Error desconocido";
            toast.error(`Error: ${serverMessage}`);
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Toaster /> {/* ← agregar aquí */}
            <Card className="w-full max-w-md shadow-lg border border-white/10 bg-white/10 backdrop-blur-lg text-white">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold">Iniciar Sesión</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div>
                            <CustomInputField
                                {...register("correo")}
                                label="Correo electrónico"
                                placeholder="ejemplo@correo.com"
                                error={errors.correo?.message} />
                        </div>
                        <div>
                            <Label htmlFor="password" className="text-white">
                                Contraseña
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="********"
                                {...register("contrasena")}
                                className="bg-white text-white placeholder:text-gray-400 border border-gray-300"
                            />
                            {errors.contrasena && (
                                <p className="text-red-400 text-sm mt-1">{errors.contrasena.message}</p>
                            )}
                        </div>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-accent hover:bg-accent/90 text-white font-semibold mt-2"
                        >
                            {isSubmitting ? "Ingresando..." : "Ingresar"}
                        </Button>

                        <p className="text-sm text-center mt-4 text-gray-300">
                            ¿No tienes cuenta?{" "}
                            <a href="/user/create" className="text-accent underline hover:text-accent/80">
                                Regístrate
                            </a>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}