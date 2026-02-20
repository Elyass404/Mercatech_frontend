import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { clientService } from '../services/clientService';
import Navbar from '../components/Navbar';

export default function ClientDetails() {
    const { id } = useParams();
    const [client, setClient] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchClient = async () => {
            try {
                const data = await clientService.getClientById(id);
                setClient(data);
            } catch (err) {
                console.error("Erreur:", err);
                setError("Impossible de charger les détails du client.");
            }
        };
        fetchClient();
    }, [id]);

    if (error) return <div className="p-8 text-red-600 text-center mt-10">{error}</div>;
    if (!client) return <div className="p-8 text-gray-500 text-center mt-10">Chargement...</div>;

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="p-8 max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Détails du Client</h1>
                    <Link to="/clients" className="text-blue-600 hover:underline">
                        &larr; Retour à la liste
                    </Link>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-md mb-6">
                    <div className="flex justify-between items-start border-b pb-6 mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">{client.name}</h2>
                            <p className="text-gray-500">{client.email}</p>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                            client.loyaltyTier === 'GOLD' ? 'bg-yellow-100 text-yellow-800' : 
                            client.loyaltyTier === 'SILVER' ? 'bg-gray-200 text-gray-800' : 
                            'bg-orange-100 text-orange-800'
                        }`}>
                            Niveau {client.loyaltyTier || 'Standard'}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <h3 className="text-sm font-semibold text-blue-800 uppercase tracking-wide">Commandes Totales</h3>
                            <p className="text-3xl font-bold text-blue-900 mt-2">{client.totalOrders || 0}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                            <h3 className="text-sm font-semibold text-green-800 uppercase tracking-wide">Total Dépensé</h3>
                            <p className="text-3xl font-bold text-green-900 mt-2">{(client.cumulativeAmount || 0).toFixed(2)} DH</p>
                        </div>
                    </div>

                    <div className="mt-8 text-sm text-gray-500 grid grid-cols-2 gap-4">
                        <p><strong>Première commande :</strong> {client.firstOrderDate ? new Date(client.firstOrderDate).toLocaleDateString('fr-FR') : 'Aucune'}</p>
                        <p><strong>Dernière commande :</strong> {client.lastOrderDate ? new Date(client.lastOrderDate).toLocaleDateString('fr-FR') : 'Aucune'}</p>
                        <p><strong>Client depuis :</strong> {new Date(client.createdAt).toLocaleDateString('fr-FR')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}