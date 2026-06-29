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
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/products?search=${encodeURIComponent(searchQuery)}`);
        if (mounted) {
          setProducts(response.data || []);
          setError(null);
        }
      } catch (err) {
        console.warn("Backend API failed, trying fallback to external API:", err);
        try {
          const response = await axios.get("https://api.escuelajs.co/api/v1/products?limit=24");
          if (mounted) {
            let data = response.data || [];
            if (searchQuery) {
              const query = searchQuery.toLowerCase();
              data = data.filter(p =>
                (p.title && p.title.toLowerCase().includes(query)) ||
                (p.description && p.description.toLowerCase().includes(query)) ||
                (p.category && typeof p.category === 'object' ? p.category.name.toLowerCase().includes(query) : false)
              );
            }
            setProducts(data);
            setError(null);
          }
        } catch (fallbackErr) {
          if (mounted) setError(fallbackErr);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [searchQuery]);

  const featuredProducts = products
    .slice()
    .sort((a, b) => {
      const aDate = new Date(a.creationAt || a.createdAt).getTime() || 0;
      const bDate = new Date(b.creationAt || b.createdAt).getTime() || 0;
      if (bDate !== aDate) return bDate - aDate;
      return b.id - a.id;
    })
    .slice(0, 10);

  // If search is active, show only actual matching items. If search is empty, we can show up to 24 items (looping if needed to preserve the design).
  const displayedGridProducts = searchQuery
    ? products
    : Array.from({ length: 24 }).map((_, idx) => {
        if (!products.length) return null;
        return products[idx % products.length];
      }).filter(Boolean);

  return (
    <main className="bg-[#f7f5f1] min-h-screen">
      <BannerSlider />

      {/* Modern Sleek Search Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-2">
        <div className="relative max-w-xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search products by title, category, description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-12 pr-4 py-3.5 border border-stone-200 rounded-full bg-white/80 backdrop-blur-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent shadow-sm transition-all duration-200"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-stone-400 hover:text-stone-600"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="overflow-hidden rounded-[2rem] bg-slate-100 p-4 sm:p-6">
          <div className="rounded-t-lg bg-white px-5 py-5 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-3xl font-semibold text-stone-900">
                {searchQuery ? `Search Results for "${searchQuery}"` : "Featured Products"}
              </h2>
              <p className="mt-2 text-sm text-stone-600 max-w-2xl">
                {searchQuery ? `Found ${products.length} products matching your query.` : "Browse our favorite new pieces for your next look."}
              </p>
            </div>
          </div>

          {searchQuery && products.length === 0 ? (
            <div className="p-12 text-center text-stone-500 bg-white rounded-b-lg">
              No products found matching your search.
            </div>
          ) : (
            <>
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
                        <p className="text-sm leading-6 text-stone-600 truncate">{product.description}</p>
                      </div>
                    </article>
                  ))
                )}
              </div>

              <div className="my-5 border-t border-stone-900" aria-hidden="true" />

              <div className="mt-6">
                <h3 className="sr-only">More Products</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {displayedGridProducts.map((product, idx) => (
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
                        <h4 className="text-sm font-semibold text-stone-900 mt-1 truncate">{product.title}</h4>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

export default ProductPage;
