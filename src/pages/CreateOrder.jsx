
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { clientService } from '../services/clientService';
import { productService } from '../services/productService';
import Navbar from '../components/Navbar';

export default function CreateOrder() {
    const navigate = useNavigate();

    // Data from backend for our dropdowns
    const [clients, setClients] = useState([]);
    const [availableProducts, setAvailableProducts] = useState([]);

    // Form State
    const [clientId, setClientId] = useState('');
    const [promoCode, setPromoCode] = useState('');
    const [error, setError] = useState('');
    
    // Dynamic list of items! Starts with one empty item.
    const [items, setItems] = useState([{ productId: '', quantity: 1 }]);

    // Fetch clients and products on load
    useEffect(() => {
        const fetchData = async () => {
            try {
                const clientsData = await clientService.getAllClients();
                setClients(clientsData);

                // Fetching a large page of products for the dropdown
                const productsData = await productService.getAllProducts(0, 100); 
                setAvailableProducts(productsData.content);
            } catch (err) {
                console.error("Erreur de chargement:", err);
                setError("Impossible de charger les clients ou les produits.");
            }
        };
        fetchData();
    }, []);

    // --- Dynamic Form Handlers ---
    const handleAddItem = () => {
        setItems([...items, { productId: '', quantity: 1 }]);
    };

    const handleRemoveItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    // --- Submit Logic ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Basic validation
        if (!clientId) {
            return setError("Veuillez sélectionner un client.");
        }
        
        // Filter out any items where the user didn't actually select a product
        const validItems = items
            .filter(item => item.productId !== '')
            .map(item => ({
                productId: parseInt(item.productId),
                quantity: parseInt(item.quantity)
            }));

        if (validItems.length === 0) {
            return setError("L'ordre doit contenir au moins un produit valide.");
        }

        // Construct the payload to match your OrderRequest DTO exactly
        const orderRequest = {
            clientId: parseInt(clientId),
            items: validItems,
            promoCode: promoCode.trim() === '' ? null : promoCode.trim()
        };

        try {
            await orderService.createOrder(orderRequest);
            navigate('/orders'); // Send them back to the table on success!
        } catch (err) {
            console.error("Erreur de création:", err);
            // If the backend sends a validation error (like invalid promo code), show it
            if (err.response && err.response.data) {
                setError("Erreur de validation. Vérifiez le format du code promo (ex: PROMO-1234) et le stock.");
            } else {
                setError("Erreur lors de la création de la commande.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            
            <div className="p-8 max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Nouvelle Commande</h1>
                    <Link to="/orders" className="text-blue-600 hover:underline font-medium">
                        &larr; Retour aux commandes
                    </Link>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-md">
                    {error && <div className="bg-red-50 text-red-600 p-4 rounded mb-6 border border-red-200">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        
                        {/* --- Client & Promo Section --- */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded border">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Sélectionner un Client *</label>
                                <select 
                                    value={clientId}
                                    onChange={(e) => setClientId(e.target.value)}
                                    className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 bg-white"
                                    required
                                >
                                    <option value="">-- Choisir un client --</option>
                                    {clients.map(client => (
                                        <option key={client.id} value={client.id}>{client.name} ({client.email})</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Code Promo (Optionnel)</label>
                                <input 
                                    type="text"
                                    placeholder="ex: PROMO-ABCD"
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value)}
                                    className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">Format requis: PROMO-XXXX</p>
                            </div>
                        </div>

                        {/* --- Dynamic Products Section --- */}
                        <div>
                            <div className="flex justify-between items-end mb-4 border-b pb-2">
                                <h3 className="text-lg font-bold text-gray-800">Produits</h3>
                                <button 
                                    type="button"
                                    onClick={handleAddItem}
                                    className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded font-bold hover:bg-green-200 transition"
                                >
                                    + Ajouter une ligne
                                </button>
                            </div>

                            <div className="space-y-4">
                                {items.map((item, index) => (
                                    <div key={index} className="flex items-center space-x-4 bg-white p-4 border rounded shadow-sm">
                                        <div className="flex-grow">
                                            <label className="block text-xs text-gray-500 font-bold mb-1">Produit</label>
                                            <select
                                                value={item.productId}
                                                onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                                                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                                                required
                                            >
                                                <option value="">-- Choisir un produit --</option>
                                                {availableProducts.map(product => (
                                                    <option key={product.id} value={product.id}>
                                                        {product.name} - {product.unitPrice} DH (Stock: {product.stock})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        
                                        <div className="w-32">
                                            <label className="block text-xs text-gray-500 font-bold mb-1">Quantité</label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 text-center"
                                                required
                                            />
                                        </div>

                                        {items.length > 1 && (
                                            <div className="pt-5">
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveItem(index)}
                                                    className="text-red-500 hover:text-red-700 p-2"
                                                    title="Supprimer cette ligne"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end pt-6 border-t">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white font-bold py-3 px-8 rounded shadow hover:bg-blue-700 transition"
                            >
                                Valider la Commande
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}