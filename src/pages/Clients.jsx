// src/pages/Clients.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { clientService } from '../services/clientService';
import Navbar from '../components/Navbar';

export default function Clients() {
    const [clients, setClients] = useState([]);
    const [error, setError] = useState('');

    const fetchClients = async () => {
        try {
            const data = await clientService.getAllClients();
            setClients(data);
        } catch (err) {
            console.error("Erreur lors de la récupération des clients:", err);
            setError("Impossible de charger la liste des clients.");
        }
    };

    useEffect(() => {
        const initFetch = async () => {
            await fetchClients();
        };
        
        initFetch();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
            try {
                await clientService.deleteClient(id);
                fetchClients(); // Refresh the list
            } catch (err) {
                console.error("Erreur lors de la suppression:", err);
                alert("Impossible de supprimer ce client.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="p-8 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Clients</h1>
                    <Link
                        to="/clients/new"
                        className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
                    >
                        + Nouveau Client
                    </Link>
                </div>

                {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4">{error}</div>}

                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-4 font-semibold text-gray-600">Nom & Email</th>
                                <th className="p-4 font-semibold text-gray-600">Fidélité</th>
                                <th className="p-4 font-semibold text-gray-600">Commandes</th>
                                <th className="p-4 font-semibold text-gray-600">Total Dépensé (DH)</th>
                                <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map((client) => (
                                <tr key={client.id} className="border-b hover:bg-gray-50">
                                    <td className="p-4">
                                        <div className="font-medium text-gray-800">{client.name}</div>
                                        <div className="text-sm text-gray-500">{client.email}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                                            client.loyaltyTier === 'GOLD' ? 'bg-yellow-100 text-yellow-800' : 
                                            client.loyaltyTier === 'SILVER' ? 'bg-gray-200 text-gray-800' : 
                                            'bg-orange-100 text-orange-800' // Assuming BRONZE or default
                                        }`}>
                                            {client.loyaltyTier || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="p-4">{client.totalOrders || 0}</td>
                                    <td className="p-4">{(client.cumulativeAmount || 0).toFixed(2)}</td>
                                    <td className="p-4 text-right space-x-3">
                                        <Link to={`/clients/${client.id}`} className="text-green-600 hover:text-green-800 font-medium">
                                            Détails
                                        </Link>
                                        <Link to={`/clients/${client.id}/edit`} className="text-blue-500 hover:text-blue-700 font-medium">
                                            Éditer
                                        </Link>
                                        <button onClick={() => handleDelete(client.id)} className="text-red-500 hover:text-red-700 font-medium">
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {clients.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-4 text-center text-gray-500">
                                        Aucun client trouvé.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}