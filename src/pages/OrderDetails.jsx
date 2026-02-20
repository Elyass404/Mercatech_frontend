import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import Navbar from '../components/Navbar';

export default function OrderDetails() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const data = await orderService.getOrderById(id);
                setOrder(data);
            } catch (err) {
                console.error("Erreur:", err);
                setError("Impossible de charger les détails de la commande.");
            }
        };
        fetchOrder();
    }, [id]);

    if (error) return <div className="p-8 text-red-600 text-center mt-10">{error}</div>;
    if (!order) return <div className="p-8 text-gray-500 text-center mt-10">Chargement de la commande...</div>;

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
            
            <div className="p-8 max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Commande #{order.id}
                    </h1>
                    <Link to="/orders" className="text-blue-600 hover:underline font-medium">
                        &larr; Retour aux commandes
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {/* --- Client Info Card --- */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 col-span-2">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Informations Client</h2>
                        <div className="text-gray-600">
                            <p className="mb-1"><span className="font-semibold text-gray-800">Nom:</span> {order.client?.name}</p>
                            <p className="mb-1"><span className="font-semibold text-gray-800">Email:</span> {order.client?.email}</p>
                            <p><span className="font-semibold text-gray-800">Date de la commande:</span> {new Date(order.orderDate).toLocaleString('fr-FR')}</p>
                        </div>
                    </div>

                    {/* --- Status Card --- */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col justify-center items-center">
                        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Statut Actuel</h2>
                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusStyle(order.status)}`}>
                            {order.status}
                        </span>
                    </div>
                </div>

                {/* --- Order Items Table --- */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden mb-6">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-4 font-semibold text-gray-600">Produit</th>
                                <th className="p-4 font-semibold text-gray-600 text-center">Quantité</th>
                                <th className="p-4 font-semibold text-gray-600 text-right">Prix Unitaire</th>
                                <th className="p-4 font-semibold text-gray-600 text-right">Sous-total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.orderItems?.map((item, index) => (
                                <tr key={index} className="border-b last:border-0 hover:bg-gray-50">
                                    <td className="p-4 font-medium text-gray-800">{item.productName}</td>
                                    <td className="p-4 text-center text-gray-600">{item.quantity}</td>
                                    <td className="p-4 text-right text-gray-600">{item.unitPriceAtOrder.toFixed(2)} DH</td>
                                    <td className="p-4 text-right font-semibold text-gray-800">{item.subTotal.toFixed(2)} DH</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* --- Financial Summary --- */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex justify-end">
                    <div className="w-full md:w-1/2 lg:w-1/3 space-y-3">
                        <div className="flex justify-between text-gray-600">
                            <span>Sous-total HT:</span>
                            <span>{order.subTotal.toFixed(2)} DH</span>
                        </div>
                        
                        {order.promoCode && (
                            <div className="flex justify-between text-green-600">
                                <span>Remise ({order.promoCode}):</span>
                                <span>-{order.discount.toFixed(2)} DH</span>
                            </div>
                        )}

                        <div className="flex justify-between text-gray-600 border-b pb-3">
                            <span>TVA ({order.tva}%):</span>
                            <span>{((order.subTotal - order.discount) * (order.tva / 100)).toFixed(2)} DH</span>
                        </div>

                        <div className="flex justify-between text-xl font-bold text-gray-800 pt-2">
                            <span>Total TTC:</span>
                            <span className="text-green-700">{order.total.toFixed(2)} DH</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}