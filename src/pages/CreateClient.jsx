// src/pages/CreateClient.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { clientService } from '../services/clientService';
import Navbar from '../components/Navbar';

export default function CreateClient() {
    // State for the ClientUserRequest DTO fields
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const clientUserRequest = {
            username,
            password,
            name,
            email
        };

        try {
            await clientService.createClient(clientUserRequest);
            // If successful, take the admin back to the client list
            navigate('/clients');
        } catch (err) {
            console.error("Erreur lors de la création du client:", err);
            setError("Erreur : Impossible de créer ce client. Vérifiez les informations (l'email ou le nom d'utilisateur existe peut-être déjà).");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            
            <div className="p-8 max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Nouveau Client</h1>
                    <Link to="/clients" className="text-blue-600 hover:underline font-medium">
                        &larr; Retour à la liste
                    </Link>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6 text-sm border border-red-200">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* --- Profil Client --- */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Profil Client</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Nom Complet</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Adresse Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* --- Identifiants de Connexion --- */}
                        <div className="pt-4">
                            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Identifiants de Connexion</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Nom d'utilisateur</label>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Mot de passe</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-6 border-t mt-6">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white font-bold py-2 px-8 rounded shadow hover:bg-blue-700 transition duration-200"
                            >
                                Créer le client
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}