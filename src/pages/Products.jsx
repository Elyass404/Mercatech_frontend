import { useState, useEffect } from 'react';
import { productService } from '../services/productService';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        // 1. Define the async function INSIDE the effect
        const fetchProducts = async () => {
            try {
                const data = await productService.getAllProducts(page, 10);
                setProducts(data.content);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error("Erreur lors de la récupération des produits:", error);
            }
        };

        // 2. Call it immediately
        fetchProducts();
    }, [page]);


    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Produits</h1>
                <button className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition">
                    + Nouveau Produit
                </button>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">Nom</th>
                            <th className="p-4 font-semibold text-gray-600">Prix HT (DH)</th>
                            <th className="p-4 font-semibold text-gray-600">Stock</th>
                            <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id} className="border-b hover:bg-gray-50">
                                <td className="p-4">{product.name}</td>
                                <td className="p-4">{product.unitPrice.toFixed(2)}</td>
                                <td className="p-4">{product.stock}</td>
                                <td className="p-4 text-right space-x-3">
                                    <button className="text-blue-500 hover:text-blue-700">Éditer</button>
                                    <button className="text-red-500 hover:text-red-700">Supprimer</button>
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr>
                                <td colSpan="4" className="p-4 text-center text-gray-500">
                                    Aucun produit trouvé.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
                <button 
                    disabled={page === 0}
                    onClick={() => setPage(page - 1)}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    Précédent
                </button>
                <span className="text-gray-600">Page {page + 1} sur {totalPages || 1}</span>
                <button 
                    disabled={page >= totalPages - 1 || totalPages === 0}
                    onClick={() => setPage(page + 1)}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    Suivant
                </button>
            </div>
        </div>
    );
}