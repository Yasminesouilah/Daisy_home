import { NavLink, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../context/AuthContext.jsx';

export default function AdminLayout() {
  const { signOut } = useAdminAuth();
  return <div className="admin-layout"><aside><strong>Daisy Home Admin</strong><nav><NavLink to="/admin">Overview</NavLink><NavLink to="/admin/products">Products</NavLink><NavLink to="/admin/orders">Orders</NavLink><NavLink to="/admin/messages">Messages</NavLink></nav><button type="button" onClick={signOut}>Sign out</button></aside><main><Outlet /></main></div>;
}