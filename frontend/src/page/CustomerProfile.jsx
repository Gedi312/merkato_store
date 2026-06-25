import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredUser, setStoredUser, clearStoredUser } from "../utils/authService";

export default function CustomerProfile() {
	const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });
	const [saved, setSaved] = useState(false);
	const navigate = useNavigate();

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
						<div className="rounded-3xl border border-stone-200 bg-stone-50 p-5">
							<p className="text-xs uppercase tracking-[0.25em] text-stone-500 mb-2">Address</p>
							<p className="text-lg font-medium text-stone-900">{form.address || "Not available"}</p>
						</div>
					</div>

					<div className="flex flex-wrap items-center gap-3">
						<button type="button" onClick={handleLogout} className="px-5 py-2 border rounded-full text-sm font-medium text-stone-700 hover:bg-stone-100 transition">
							Log out
						</button>
					</div>
				</div>
			) : (
				<div className="rounded-3xl border border-stone-200 bg-white p-8 text-center shadow-sm">
					<p className="text-stone-700">No profile data found. Please log in or register to view your profile.</p>
				</div>
			)}
		</div>
	);
}
