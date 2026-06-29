import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredUser, setStoredUser, clearStoredUser } from "../utils/authService";

export default function CustomerProfile() {
	const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });
	const [saved, setSaved] = useState(false);
	const [showHistory, setShowHistory] = useState(false);
	const [orders, setOrders] = useState([]);
	const navigate = useNavigate();

	// Load user profile data
	useEffect(() => {
		try {
			const stored = getStoredUser();
			if (stored) setForm({
				name: stored.name || "",
				email: stored.email || "",
				phone: stored.phone || "",
				address: stored.address || "",
			});
		} catch (e) {
			// ignore
		}
	}, []);

	// Load or generate order history
	useEffect(() => {
		const storedOrders = localStorage.getItem("orderHistory");
		if (storedOrders) {
			setOrders(JSON.parse(storedOrders));
		} else {
			// Generate mock orders for demonstration
			const mockOrders = [
				{ id: 1, date: "2025-01-15", total: 89.99, status: "Delivered", items: ["Wireless Mouse", "USB-C Hub"] },
				{ id: 2, date: "2025-02-20", total: 45.50, status: "Shipped", items: ["Bluetooth Speaker"] },
				{ id: 3, date: "2025-03-10", total: 120.00, status: "Processing", items: ["Laptop Stand", "HDMI Cable", "Keyboard"] },
			];
			setOrders(mockOrders);
			localStorage.setItem("orderHistory", JSON.stringify(mockOrders));
		}
	}, []);

	function handleChange(e) {
		const { name, value } = e.target;
		setForm((f) => ({ ...f, [name]: value }));
	}

	function handleSave(e) {
		e.preventDefault();
		const stored = getStoredUser() || {};
		const user = { ...stored, ...form };
		setStoredUser(user);
		setSaved(true);
		setTimeout(() => setSaved(false), 2000);
	}

	function handleLogout() {
		clearStoredUser();
		navigate("/");
	}

	return (
		<div className="max-w-4xl mx-auto px-6 py-12">
			<h1 className="text-2xl font-semibold mb-6">Customer Profile</h1>

			{form.name || form.email ? (
				<div className="space-y-6 rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
					{/* Avatar and greeting */}
					<div className="flex items-center gap-4">
						<div className="flex h-16 w-16 items-center justify-center rounded-full bg-stone-900 text-xl font-semibold text-white">
							{form.name ? form.name.charAt(0).toUpperCase() : "U"}
						</div>
						<div>
							<p className="text-sm text-stone-500">Logged in as</p>
							<h2 className="text-2xl font-semibold text-stone-900">{form.name || "User"}</h2>
							<p className="text-sm text-stone-500">{form.email || "No email set"}</p>
						</div>
					</div>

					{/* Personal info cards */}
					<div className="grid gap-4 sm:grid-cols-2">
						<div className="rounded-3xl border border-stone-200 bg-stone-50 p-5">
							<p className="text-xs uppercase tracking-[0.25em] text-stone-500 mb-2">Full Name</p>
							<p className="text-lg font-medium text-stone-900">{form.name || "Not available"}</p>
						</div>
						<div className="rounded-3xl border border-stone-200 bg-stone-50 p-5">
							<p className="text-xs uppercase tracking-[0.25em] text-stone-500 mb-2">Email</p>
							<p className="text-lg font-medium text-stone-900">{form.email || "Not available"}</p>
						</div>
					</div>

					<div className="grid gap-4 sm:grid-cols-2">
						<div className="rounded-3xl border border-stone-200 bg-stone-50 p-5">
							<p className="text-xs uppercase tracking-[0.25em] text-stone-500 mb-2">Phone</p>
							<p className="text-lg font-medium text-stone-900">{form.phone || "Not available"}</p>
						</div>
						{/* Order History - replaces Address */}
						<div
							className="rounded-3xl border border-stone-200 bg-stone-50 p-5 cursor-pointer hover:bg-stone-100 transition"
							onClick={() => setShowHistory(true)}
						>
							<p className="text-xs uppercase tracking-[0.25em] text-stone-500 mb-2">Order History</p>
							<p className="text-lg font-medium text-stone-900 flex items-center gap-2">
								View orders
								<span className="text-sm text-stone-400">({orders.length})</span>
							</p>
						</div>
					</div>

					{/* Action buttons */}
					<div className="flex flex-wrap items-center gap-3">
						<button type="button" onClick={handleLogout} className="px-5 py-2 border rounded-full text-sm font-medium text-stone-700 hover:bg-stone-100 transition">
							Log out
						</button>
						{/* Optional: Add an edit button if you want to enable editing */}
					</div>
				</div>
			) : (
				<div className="rounded-3xl border border-stone-200 bg-white p-8 text-center shadow-sm">
					<p className="text-stone-700">No profile data found. Please log in or register to view your profile.</p>
				</div>
			)}

			{/* Order History Modal */}
			{showHistory && (
				<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
						<div className="flex justify-between items-center p-6 border-b border-stone-200">
							<h3 className="text-xl font-semibold text-stone-900">Order History</h3>
							<button
								onClick={() => setShowHistory(false)}
								className="text-stone-400 hover:text-stone-600 transition"
							>
								<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>
						<div className="p-6 overflow-y-auto flex-1">
							{orders.length === 0 ? (
								<p className="text-stone-500 text-center py-8">No orders yet.</p>
							) : (
								<ul className="space-y-4">
									{orders.map((order) => (
										<li key={order.id} className="border border-stone-200 rounded-2xl p-4 hover:bg-stone-50 transition">
											<div className="flex justify-between items-start">
												<div>
													<p className="font-medium text-stone-900">Order #{order.id}</p>
													<p className="text-sm text-stone-500">{order.date}</p>
													<div className="flex flex-wrap gap-1 mt-1">
														{order.items.map((item, idx) => (
															<span key={idx} className="bg-stone-100 text-stone-700 text-xs px-2 py-0.5 rounded-full">
																{item}
															</span>
														))}
													</div>
												</div>
												<div className="text-right">
													<p className="text-lg font-bold text-stone-900">${order.total.toFixed(2)}</p>
													<span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-1 ${
														order.status === "Delivered" ? "bg-emerald-100 text-emerald-800" :
														order.status === "Shipped" ? "bg-blue-100 text-blue-800" :
														"bg-amber-100 text-amber-800"
													}`}>
														{order.status}
													</span>
												</div>
											</div>
										</li>
									))}
								</ul>
							)}
						</div>
						<div className="p-6 border-t border-stone-200 text-right">
							<button
								onClick={() => setShowHistory(false)}
								className="px-6 py-2 bg-stone-900 text-white rounded-full hover:bg-stone-800 transition"
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}