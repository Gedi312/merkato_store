export const initialProducts = [
  { id: 1, name: 'Premium Wireless Headphones', price: 299.99, category: 'Electronics', stock: 45, status: 'Active' },
  { id: 2, name: 'Minimalist Desk Lamp', price: 89.50, category: 'Home & Office', stock: 120, status: 'Active' },
  { id: 3, name: 'Mechanical Keyboard v2', price: 159.00, category: 'Electronics', stock: 0, status: 'Out of Stock' },
  { id: 4, name: 'Ergonomic Office Chair', price: 450.00, category: 'Furniture', stock: 12, status: 'Active' },
  { id: 5, name: 'Ceramic Coffee Mug', price: 24.00, category: 'Home & Office', stock: 200, status: 'Active' },
];

export const initialCategories = [
  { id: 101, name: 'Electronics', description: 'Gadgets, devices, and accessories', productCount: 42 },
  { id: 102, name: 'Home & Office', description: 'Desk accessories, stationery', productCount: 18 },
  { id: 103, name: 'Furniture', description: 'Chairs, desks, and storage', productCount: 8 },
];

export const initialStats = {
  totalOrders: 1248,
  totalSales: 45290.50,
  totalProducts: initialProducts.length,
};
