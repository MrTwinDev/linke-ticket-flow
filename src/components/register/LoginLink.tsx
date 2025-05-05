
import { Link } from "react-router-dom";

const LoginLink = () => {
  return (
    <div className="text-center mt-6">
      <p className="text-sm text-gray-600">
        Já possui uma conta?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
};

export default LoginLink;
