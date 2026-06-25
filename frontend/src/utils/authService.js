import axios from "axios";

const API_BASE = "https://api.escuelajs.co/api/v1";
const USERS_API = `${API_BASE}/users`;
const STORAGE_KEY = "user";
const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "admin";
const ADMIN_USER = {
  id: 0,
  email: ADMIN_EMAIL,
  password: ADMIN_PASSWORD,
  name: "Admin",
  role: "admin",
  avatar: "https://api.lorem.space/image/face?w=150&h=150&hash=admin",
};

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch (error) {
    return null;
  }
}

export function setStoredUser(user) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("auth-changed"));
}

export function clearStoredUser() {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("auth-changed"));
}

export function getUsers(limit = 200) {
  return axios.get(`${USERS_API}?limit=${limit}`);
}

export async function loginUser(email, password) {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    return ADMIN_USER;
  }
  const response = await getUsers(200);
  const user = response.data.find(
    (item) => item.email === email && item.password === password,
  );
  if (!user) {
    const error = new Error("Invalid email or password");
    error.response = { data: "Invalid email or password" };
    throw error;
  }
  return user;
}

export function registerApi(name, email, password, role = "customer") {
  if (email === ADMIN_EMAIL) {
    const error = new Error("Admin account cannot be created here");
    error.response = { data: "Admin account cannot be created here" };
    return Promise.reject(error);
  }
  return axios.post(USERS_API, {
    name,
    email,
    password,
    role,
    avatar: `https://api.lorem.space/image/face?w=150&h=150&hash=${encodeURIComponent(email)}`,
  });
}

export function determineRoleFromResponse(user, email) {
  if (!user) {
    return email === ADMIN_EMAIL ? "admin" : "user";
  }
  if (typeof user.role === "string") {
    if (user.role.toLowerCase().includes("admin")) return "admin";
    if (user.role.toLowerCase().includes("customer")) return "user";
    return user.role.toLowerCase();
  }
  return email === ADMIN_EMAIL ? "admin" : "user";
}
