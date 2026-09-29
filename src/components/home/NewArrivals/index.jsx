import { useProducts } from '../../../hooks/useProducts.js';
import ProductGrid from '../../product/ProductGrid/index.jsx';

export default function NewArrivals() {
  const { data, loading } = useProducts();
  return <section className="page-content"><span className="eyebrow">Just landed</span><h2 className="page-title">New arrivals</h2>{loading ? <p>Loading arrivals…</p> : <ProductGrid products={data.filter((product) => product.isNew)} />}</section>;
}