import { useEffect, useState } from "react";
import { getProductBySlug, getRelatedProducts } from "../services/productService";

export function useProduct(slug) {
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setNotFound(false);
    setProduct(null);
    setRelated([]);

    getProductBySlug(slug).then(async (result) => {
      if (!active) return;
      if (!result) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setProduct(result);
      const recommendations = await getRelatedProducts(result);
      if (!active) return;
      setRelated(recommendations);
      setLoading(false);
    }).catch(() => {
      if (!active) return;
      setNotFound(true);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [slug]);

  return { product, related, loading, notFound };
}