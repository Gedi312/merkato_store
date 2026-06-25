import { useNavigate } from "react-router-dom";
import BannerSlider from "../components/BannerSlide";
import { useEffect, useState } from "react";
import axios from "axios";

const secureImageUrl = (url) => {
  if (!url) return "https://via.placeholder.com/480x360?text=No+Image";
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "http:") {
      parsed.protocol = "https:";
      return parsed.toString();
    }
    return url;
  } catch {
    return "https://via.placeholder.com/480x360?text=No+Image";
  }
};

function ProductPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://api.escuelajs.co/api/v1/products?limit=24");
        if (mounted) setProducts(response.data || []);
      } catch (err) {
        if (mounted) setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProducts();
    return () => {
      mounted = false;
    };
  }, []);

  const featuredProducts = products
    .slice()
    .sort((a, b) => {
      const aDate = new Date(a.creationAt).getTime() || 0;
      const bDate = new Date(b.creationAt).getTime() || 0;
      if (bDate !== aDate) return bDate - aDate;
      return b.id - a.id;
    })
    .slice(0, 10);

  return (
    <main className="bg-[#f7f5f1] min-h-screen">
      <BannerSlider />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="overflow-hidden rounded-[2rem] bg-slate-100 p-4 sm:p-6">
          <div className="rounded-t-lg bg-white px-5 py-5 shadow-sm">
            <h2 className="text-3xl font-semibold text-stone-900">Featured Products</h2>
            <p className="mt-2 text-sm text-stone-600 max-w-2xl">Browse our favorite new pieces for your next look.</p>
          </div>

          <div className="flex gap-0 overflow-x-auto pb-1 snap-x snap-mandatory">
            {loading ? (
              <div className="p-6">Loading products…</div>
            ) : error ? (
              <div className="p-6 text-red-600">Failed to load products</div>
            ) : (
              featuredProducts.map((product) => (
                <article
                  key={product.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/product/${product.id}`)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      navigate(`/product/${product.id}`);
                    }
                  }}
                  className="min-w-[200px] max-w-[240px] shrink-0 snap-start cursor-pointer overflow-hidden rounded-3xl bg-white shadow-[0_18px_50px_rgba(0,0,0,0.06)] transition hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden">
                    <img
                      src={secureImageUrl(product.images?.[0] || product.image)}
                      alt={product.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="space-y-3 p-6">
                    <div className="flex items-center justify-between text-sm text-stone-500">
                      <span>New</span>
                      <span className="font-semibold text-stone-900">${product.price}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-stone-900">{product.title}</h3>
                    <p className="text-sm leading-6 text-stone-600">{product.description}</p>
                  </div>
                </article>
              ))
            )}
          </div>

          <div className="my-5 border-t border-stone-900" aria-hidden="true" />

          <div className="mt-6">
            <h3 className="sr-only">More Products</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {Array.from({ length: 24 }).map((_, idx) => {
                if (!products.length) return null;
                const product = products[idx % products.length];
                return (
                  <article
                    key={`${product.id}-${idx}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate(`/product/${product.id}`)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        navigate(`/product/${product.id}`);
                      }
                    }}
                    className="cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    <div className="aspect-square w-full overflow-hidden">
                      <img
                        src={secureImageUrl(product.images?.[0] || product.image)}
                        alt={product.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <div className="flex items-center justify-between text-sm text-stone-500">
                        <span>New</span>
                        <span className="font-semibold text-stone-900">${product.price}</span>
                      </div>
                      <h4 className="text-sm font-semibold text-stone-900 mt-1">{product.title}</h4>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ProductPage;
