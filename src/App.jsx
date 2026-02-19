// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Products from './pages/Products';
import Login from './pages/Login'; 
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          {/* Automatically redirect the home page to the login screen */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/products" element={<ProtectedRoute>
                <Products />
              </ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;