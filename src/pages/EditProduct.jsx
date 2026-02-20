import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { productService } from '../services/productService';
import Navbar from '../components/Navbar';

export default function EditProduct() {
    const { id } = useParams(); // Gets the product ID from the URL
    const navigate = useNavigate();
    
    const [name, setName] = useState('');
    const [unitPrice, setUnitPrice] = useState('');
    const [stock, setStock] = useState('');
    const [error, setError] = useState('');

    // Fetch the existing product data when the page loads
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const product = await productService.getProductById(id);
                setName(product.name);
                setUnitPrice(product.unitPrice);
                setStock(product.stock);
            } catch (err) {
                console.error("Erreur lors de la récupération du produit:", err);
                setError("Impossible de charger les données du produit.");
            }
        };
        fetchProduct();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const productRequest = {
            name: name,
            unitPrice: parseFloat(unitPrice),
            stock: parseInt(stock, 10)
        };

        try {
            await productService.updateProduct(id, productRequest);
            navigate('/products');
        } catch (err) {
            console.error("Erreur lors de la modification:", err);
            setError("Erreur lors de la mise à jour du produit.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="p-8 max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Modifier Produit</h1>
                    <Link to="/products" className="text-blue-600 hover:underline">
                        &larr; Retour à la liste
                    </Link>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-md">
                    {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Nom du Produit</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Prix Unitaire (DH)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    value={unitPrice}
                                    onChange={(e) => setUnitPrice(e.target.value)}
                                    className="w-full px-4 py-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Quantité en Stock</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                    className="w-full px-4 py-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white font-bold py-2 px-6 rounded hover:bg-blue-700 transition duration-200"
                            >
                                Mettre à jour
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}