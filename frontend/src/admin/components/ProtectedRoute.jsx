import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children }) {
	const { token, loading } = useAdminAuth();

	if (loading) {
		return <div className="admin-auth-loading">Chargement...</div>;
	}

	return token ? children : <Navigate to="/admin/login" replace />;
}