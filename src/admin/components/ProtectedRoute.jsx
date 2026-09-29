import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children }) { const { token } = useAdminAuth(); return token ? children : <Navigate to="/admin/login" replace />; }