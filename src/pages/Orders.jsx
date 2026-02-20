// src/pages/Orders.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import Navbar from '../components/Navbar';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');

    const fetchOrders = async () => {
        try {
            const data = await orderService.getAllOrders();
            setOrders(data);
        } catch (err) {
            console.error("Erreur lors de la récupération des commandes:", err);
            setError("Impossible de charger la liste des commandes.");
        }
    };

    useEffect(() => {
        const initFetch = async () => {
            await fetchOrders();
        };
        initFetch();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await orderService.updateOrderStatus(orderId, newStatus);
            fetchOrders(); // Refresh table to show new status
        } catch (err) {
            console.error("Erreur lors de la mise à jour du statut:", err);
            alert("Impossible de mettre à jour le statut.");
        }
    };

    // Helper function to color-code the status badges
    const getStatusStyle = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800';
            case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
            case 'DELIVERED': return 'bg-green-100 text-green-800';
            case 'CANCELED': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="p-8 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Commandes</h1>
                    <Link
                        to="/orders/new"
                        className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
                    >
                        + Nouvelle Commande
                    </Link>
                </div>

                {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4">{error}</div>}

                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-4 font-semibold text-gray-600">N° Commande</th>
                                <th className="p-4 font-semibold text-gray-600">Date</th>
                                <th className="p-4 font-semibold text-gray-600">Client</th>
                                <th className="p-4 font-semibold text-gray-600">Total (TTC)</th>
                                <th className="p-4 font-semibold text-gray-600">Statut</th>
                                <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id} className="border-b hover:bg-gray-50">
                                    <td className="p-4 font-bold text-gray-700">#{order.id}</td>
                                    <td className="p-4 text-gray-600">
                                        {new Date(order.orderDate).toLocaleDateString('fr-FR')}
                                    </td>
                                    <td className="p-4 font-medium text-gray-800">
                                        {order.client?.name || 'Client Inconnu'}
                                    </td>
                                    <td className="p-4 font-bold text-green-700">
                                        {order.total.toFixed(2)} DH
                                    </td>
                                    <td className="p-4">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            className={`px-3 py-1 rounded text-sm font-bold border-none cursor-pointer focus:ring-0 ${getStatusStyle(order.status)}`}
                                        >
                                            <option value="PENDING">En attente</option>
                                            <option value="CONFIRMED">Confirmée</option>
                                            <option value="DELIVERED">Livrée</option>
                                            <option value="CANCELED">Annulée</option>
                                        </select>
                                    </td>
                                    <td className="p-4 text-right">
                                        <Link to={`/orders/${order.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                                            Voir Détails
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="p-4 text-center text-gray-500">
                                        Aucune commande trouvée.
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