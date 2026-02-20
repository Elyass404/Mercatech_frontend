// src/components/Navbar.jsx
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // 1. Tell Spring Boot to destroy the HTTP Session
      await authService.logout();

      // 2. Redirect the user back to the login page
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center mb-8">
      <div className="flex items-center space-x-8">
        <div className="text-xl font-bold text-blue-600 tracking-wide">
          MercaTech
        </div>
        <div className="space-x-4 hidden md:flex">
          <Link
            to="/products"
            className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
          >
            Produits
          </Link>
          <Link
            to="/clients"
            className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
          >
            Clients
          </Link>
          <Link
            to="/orders"
            className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
          >
            Commandes
          </Link>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <span className="text-gray-600 text-sm">
          {/* We can grab the username we saved during login */}
          Connecté en tant que{' '}
          <span className="font-semibold text-gray-800">Admin</span>
        </span>
        <button
          onClick={handleLogout}
          className="bg-red-50 text-red-600 px-4 py-2 rounded shadow-sm hover:bg-red-100 transition text-sm font-medium"
        >
          Se Déconnecter
        </button>
      </div>
    </nav>
  );
}
