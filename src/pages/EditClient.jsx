import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { clientService } from '../services/clientService';
import Navbar from '../components/Navbar';

export default function EditClient() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchClient = async () => {
            try {
                const client = await clientService.getClientById(id);
                setName(client.name);
                setEmail(client.email);
            } catch (err) {
                console.error("Erreur:", err);
                setError("Impossible de charger les données du client.");
            }
        };
        fetchClient();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const clientRequest = { name, email };

        try {
            await clientService.updateClient(id, clientRequest);
            navigate('/clients');
        } catch (err) {
            console.error("Erreur lors de la modification:", err);
            setError("Erreur lors de la mise à jour du client.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="p-8 max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Modifier Client</h1>
                    <Link to="/clients" className="text-blue-600 hover:underline">
                        &larr; Retour à la liste
                    </Link>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-md">
                    {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Nom Complet</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Adresse Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                required
                            />
                        </div>
                        <div className="flex justify-end pt-4">
                            <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-6 rounded hover:bg-blue-700 transition">
                                Mettre à jour
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}