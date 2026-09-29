import { products } from '../../data/products.js';
import DataTable from '../components/DataTable.jsx';

export default function Products() { return <section><h1>Products</h1><DataTable columns={[{ key: 'name', label: 'Product' }, { key: 'category', label: 'Category' }, { key: 'price', label: 'Price' }]} rows={products} /></section>; }