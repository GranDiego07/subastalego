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
import { Save, ArrowLeft, Plus, X } from "lucide-react";

// servicios
import UsuarioService from "../../services/UsuariosService";
import EstadoServicio from "@/services/CategoriaLegoService";
import CondicionLegoService from "@/services/CondicionLegoService";
import EstadoLegoService from "@/services/EstadoLegoService";

// componentes reutilizables
import { CustomSelect } from "../ui/custom/custom-select";


export function CreateLego() {
  const navigate = useNavigate();

  /*** Estados ***/
  const [dataUsuarios, setDataUsuarios] = useState([]);
  const [dataCategioria, setDataCategoria] = useState([]);
  const [dataCondicion, setDataCondicion] = useState([]);
  const [dataEstado, setDataEstado] = useState([]);
  
  const [files, setFiles] = useState([]);
  const [fileURLs, setFileURLs] = useState([]);
  const [error, setError] = useState("");

  /*** Esquema Yup ***/
  const legoSchema = yup.object({
    
    nombre: yup.string().required('El nombre es requerido').min(2, 'Mínimo 2 caracteres'),
    descripcion: yup.string().required('La descripción es requerida'),
    id_vendedor: yup.number().typeError('Seleccione un vendedor').required('El vendedor es requerido'),
    id_condicion: yup.number().typeError('Seleccione una condición').required('La condición es requerida'),
    id_estado: yup.number().typeError('Seleccione un estado').required('El estado es requerido'),
    id_categoria: yup.number().typeError('Seleccione una categoría').required('La categoria es requerida'),
  });

  /*** React Hook Form ***/
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombre: "",
      descripcion: "",
      id_vendedor: "",
      id_condicion: "",
      id_estado: "",
      id_categoria: "",
    },
    resolver: yupResolver(legoSchema),
  });

  /* const { fields: categoryFields, append: appendCategory, remove: removeCategory } = useFieldArray({
    control,
    name: "categorias",
  });

  const addNewCategoria = () => appendCategory({ categoria_id: "" });
  const removeCategoria = (index) => {
    if (categoryFields.length > 1) removeCategory(index);
  }; */

  /*** Manejo de imágenes ***/
  const handleChangeImage = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    const newURLs = selectedFiles.map((f) => URL.createObjectURL(f));
    // ✅ FIX 3: prev siempre es [], nunca null
    setFiles((prev) => [...prev, ...selectedFiles]);
    setFileURLs((prev) => [...prev, ...newURLs]);
  };

  const removeImage = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setFileURLs((prev) => prev.filter((_, i) => i !== index));
  };

  /*** Carga de datos ***/
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [UsuariosRes, CategoriaLegoRes, CondicionLegoRes, EstadoLegoRes] = await Promise.all([
          UsuarioService.getAll(),
          CategoriaLegoService.getAll(),
          CondicionLegoService.getAll(),
          EstadoLegoService.getAll(),
        ]);

        // ✅ FIX 4: usar ?? [] para evitar null
        setDataUsuarios(UsuariosRes.data?.data ?? []);
        setDataCategoria(CategoriaLegoRes.data?.data ?? []);
        setDataCondicion(CondicionLegoRes.data?.data ?? []);
        setDataEstado(EstadoLegoRes.data?.data ?? []);

        console.log("Usuarios:", UsuariosRes.data?.data);
      } catch (error) {
        console.log(error);
        if (error.name !== "AbortError") setError(error.message);
      }
    };
    fetchData();
  }, []);

  /*** Submit ***/
  // ✅ FIX 5: eliminar legoSchema.isValid(), RHF ya valida antes de llegar aquí
  const onSubmit = async (dataForm) => {
    if (files.length === 0) {
      toast.error("Debes seleccionar al menos una imagen");
      return;
    }

    try {
      // Subir imágenes primero y obtener las URLs
      const imageURLs = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        const imgResponse = await ImageService.createImage(formData);
        imageURLs.push(imgResponse.data.url); // ajusta según lo que devuelva tu API
      }

      // Armar payload con el formato que espera el backend
      const payload = {
        ...dataForm,
        imagenes: imageURLs,
      };

      console.log("📦 Payload:", payload);
      const response = await LegoService.create(payload);

      if (response.data) {
        toast.success("Lego creada exitosamente", { duration: 3000 });
        navigate("/lego/table");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error al crear lego");
    }
  };
  
  // ✅ helper para ver errores de validación en consola
  const onError = (errs) => console.log("Errores de validación:", errs);

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <Card className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Crear Lego</h2>

      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">

        {/* ✅ FIX 6: name="nombre" coincide con el schema */}
        <div>
          <Label className="block mb-1 text-sm font-medium" htmlFor="nombre">Nombre</Label>
          <Controller name="nombre" control={control} render={({ field }) =>
            <Input {...field} id="nombre" placeholder="Ingrese el Nombre" />
          } />
          {errors.nombre && <p className="text-sm text-red-500">{errors.nombre.message}</p>}
        </div>

        {/* ✅ FIX 7: name="descripcion" sin typo */}
        <div>
          <Label className="block mb-1 text-sm font-medium" htmlFor="descripcion">Descripción</Label>
          <Controller name="descripcion" control={control} render={({ field }) =>
            <Input {...field} id="descripcion" placeholder="Ingrese la Descripción" />
          } />
          {errors.descripcion && <p className="text-sm text-red-500">{errors.descripcion.message}</p>}
        </div>

        {/* Usuario */}
        <div>
          <Label className="block mb-1 text-sm font-medium">Usuario</Label>
          <Controller name="id_vendedor" control={control} render={({ field }) =>
            <CustomSelect
              field={field}
              data={dataUsuarios}
              label="Usuario"
              getOptionLabel={(u) => u.nombre_completo ?? `${u.nombre} ${u.apellido}`}
              getOptionValue={(u) => u.id}
              error={errors.id_vendedor?.message}
            />
          } />
        </div>

        {/* Categorías */}
        <div>
          <Label className="block mb-1 text-sm font-medium">Categoría</Label>
          <Controller name="id_categoria" control={control} render={({ field }) =>
            <CustomSelect
              field={field}
              data={dataCategioria}
              label="Categoría"
              getOptionLabel={(item) => item.nombre}
              getOptionValue={(item) => item.id}
              error={errors.id_categoria?.message}
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

        {/* Condición */}
        <div>
          <Label className="block mb-1 text-sm font-medium">Condición</Label>
          <Controller name="id_condicion" control={control} render={({ field }) =>
            <CustomSelect
              field={field}
              data={dataCondicion}
              label="Condición"
              getOptionLabel={(item) => item.nombre}
              getOptionValue={(item) => item.id}
              error={errors.id_condicion?.message}
            />
          } />
        </div>

        {/* Imágenes */}
        <div className="mb-6">
          <Label className="block mb-1 text-sm font-medium">Imágenes</Label>

          <div className="flex flex-wrap gap-3 mb-3">
            {/* ✅ FIX 8: fileURLs siempre es [], nunca null */}
            {fileURLs.map((url, index) => (
              <div key={index} className="relative w-28 h-28">
                <img
                  src={url}
                  alt={`preview-${index}`}
                  className="w-full h-full object-cover rounded-lg border border-muted"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            <div
              className="w-28 h-28 border-2 border-dashed border-muted/50 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
              onClick={() => document.getElementById("image").click()}
            >
              <Plus className="w-6 h-6 text-muted-foreground" />
              <p className="text-xs text-muted-foreground mt-1">Agregar</p>
            </div>
          </div>

          <input
            type="file"
            id="image"
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleChangeImage}
          />
        </div>

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
          <Button type="submit" className="flex-1">
            <Save className="w-4 h-4" />
            Guardar
          </Button>
        </div>
      </form>
    </Card>
  );
}