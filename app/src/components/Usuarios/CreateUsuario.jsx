import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// shadcn/ui
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

// icons
import { Save, ArrowLeft } from "lucide-react";

// servicios
import UsuarioService from "../../services/UsuariosService";
import EstadoServicio from "../../services/EstadoUsuarioService";
import RolServicio from "../../services/RolSevice";

// componentes reutilizables
import { CustomSelect } from "../ui/custom/custom-select";


export function CreateUsuario() {
  const navigate = useNavigate();

  /*** Estados ***/
  const [dataUsuarios, setDataUsuarios] = useState([]);
  const [dataEstado, setDataEstado] = useState([]);
  const [dataRol, setDataRol] = useState([]);
  const [error, setError] = useState("");

  /*** Esquema Yup ***/
  const legoSchema = yup.object({
    correo: yup.string().required("El correo es requerido").min(2, "Mínimo 2 caracteres"),
    contrasena: yup.string().required("La contraseña es requerida").min(7, "Mínimo 7 caracteres"),
    nombre_completo: yup.string().required("El Nombre Completo es requerido"),
    id_rol: yup.number().typeError("Seleccione un rol").required("El rol es requerido"),
    id_estado: yup.number().typeError("Seleccione un estado").required("El estado es requerido"),
    
  });

  /*** React Hook Form ***/
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      correo: "",
      contrasena: "",
      nombre_completo: "",
      id_rol: "",
      id_estado: "",
      fecha_registro: new Date().toISOString(),
    },
    resolver: yupResolver(legoSchema),
  });

  /*** Carga de datos ***/
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usuariosRes, rolRes, estadoRes] = await Promise.all([
          UsuarioService.getAll(),
          RolServicio.getAll(),
          EstadoServicio.getAll(),
        ]);

        setDataUsuarios(usuariosRes.data?.data ?? []);
        setDataRol(rolRes.data?.data ?? []);
        setDataEstado(estadoRes.data?.data ?? []);

      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      }
    };
    fetchData();
  }, []);

  /*** Submit ***/
  const onSubmit = async (dataForm) => {
    try {
      const payload = {
        ...dataForm,
        fecha_registro: new Date().toISOString().slice(0, 19).replace("T", " "),
      };
      console.log("📦 Payload:", payload);
      const response = await UsuarioService.create(payload);

      if (response.data) {
        toast.success("Usuario creado exitosamente", { duration: 5000 });
        navigate("/lego/usuarios");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error al crear usuario");
    }
  };

  const onError = (errs) => console.log("Errores de validación:", errs);

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <Card className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Crear Usuario</h2>

      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">

        {/* Correo */}
        <div>
          <Label className="block mb-1 text-sm font-medium" htmlFor="correo">Correo</Label>
          <Controller name="correo" control={control} render={({ field }) =>
            <Input {...field} id="correo" placeholder="Ingrese el correo" />
          } />
          {errors.correo && <p className="text-sm text-red-500">{errors.correo.message}</p>}
        </div>

        {/* Contraseña */}
        <div>
          <Label className="block mb-1 text-sm font-medium" htmlFor="contrasena">Contraseña</Label>
          <Controller name="contrasena" control={control} render={({ field }) =>
            <Input {...field} id="contrasena" type="password" placeholder="Ingrese la contraseña" />
          } />
          {errors.contrasena && <p className="text-sm text-red-500">{errors.contrasena.message}</p>}
        </div>

        {/* Nombre Completo */}
        <div>
          <Label className="block mb-1 text-sm font-medium" htmlFor="nombre_completo">Nombre Completo</Label>
          <Controller name="nombre_completo" control={control} render={({ field }) =>
            <Input {...field} id="nombre_completo" placeholder="Ingrese el nombre completo" />
          } />
          {errors.nombre_completo && <p className="text-sm text-red-500">{errors.nombre_completo.message}</p>}
        </div>

        {/* Rol */}
        <div>
          <Label className="block mb-1 text-sm font-medium">Rol</Label>
          <Controller name="id_rol" control={control} render={({ field }) =>
            <CustomSelect
              field={field}
              data={dataRol}
              label="Rol"
              getOptionLabel={(item) => item.nombre}
              getOptionValue={(item) => item.id}
              error={errors.id_rol?.message}
            />
          } />
        </div>

        {/* Estado */}
        <div>
          <Label className="block mb-1 text-sm font-medium">Estado</Label>
          <Controller name="id_estado" control={control} render={({ field }) =>
            <CustomSelect
              field={field}
              data={dataEstado}
              label="Estado"
              getOptionLabel={(item) => item.nombre}
              getOptionValue={(item) => item.id}
              error={errors.id_estado?.message}
            />
          } />
        </div>
        {/* Fecha de Registro */}
        <div>
          <Label className="block mb-1 text-sm font-medium">Fecha de Registro</Label>
          <Input
            value={new Date().toLocaleString("es-CR")} // formato Costa Rica
            disabled
            className="bg-muted text-muted-foreground"
          />
        </div>
        {/* Botones */}
        <div className="flex justify-between gap-4 mt-6">
          <Button
            type="button"
            variant="default"
            className="flex items-center gap-2 bg-accent text-white"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4" />
            Regresar
          </Button>
          <Button type="submit" className="flex-1 flex items-center justify-center gap-2">
            <Save className="w-4 h-4" />
            Guardar
          </Button>
        </div>

      </form>
    </Card>
  );
}