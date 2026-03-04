import ticketImg from "../../assets/fondo.jfif";


export function Home() {
  return (
    <div className="relative w-full h-screen flex items-center justify-center text-center overflow-hidden">
      {/* Fondo */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `url(${ticketImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.5)",
        }}
      />

      {/* Contenido principal */}
      <div className="px-4 max-w-2xl text-white">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4 drop-shadow-lg">
          LegoPuja
        </h1>
        <p className="text-lg md:text-xl text-white/80 mb-6 drop-shadow">
          Lugar donde te puedes encontrar lo inesperado
        </p>
        <p className="text-lg md:text-xl text-white/80 mb-5 drop-shadow">
          Sitio no oficial de lego
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="/lego"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition"
          >
            Ver Legos en Subasta
          </a> 
          <a
            href="/user/login"
            className="px-6 py-3 bg-slate-700 text-white rounded-lg font-semibold shadow-lg hover::bg-slate-800 transition"
          >
            Iniciar Sesión
          </a>
        </div>
      </div>

    </div>
  );
}

