import { useEffect, useState } from "react";
import { getProducts } from "../services/productService.js";

export function useProducts() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    getProducts()
      .then((products) => { if (active) setData(products); })
      .catch((requestError) => { if (active) setError(requestError); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return { data, products: data, loading, error };
}