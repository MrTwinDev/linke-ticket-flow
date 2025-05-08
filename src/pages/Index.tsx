import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-lg text-center">
        <h1 className="text-5xl font-extrabold mb-6 text-primary">LinkeImport</h1>
        <p className="text-lg text-gray-700 mb-8">
          Simplifique a comunicação com despachantes aduaneiros através de uma plataforma intuitiva de gerenciamento de tickets.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/register"
            className="px-6 py-3 bg-blue-600 text-white rounded-md text-lg font-medium hover:bg-blue-700 transition"
          >
            Registrar
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-md text-lg font-medium hover:bg-blue-50 transition"
          >
            Entrar
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
