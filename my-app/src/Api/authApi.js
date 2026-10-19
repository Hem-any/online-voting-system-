import api from "./axiosConfig";

function saveAuth(user, token) {
  localStorage.setItem("token", token);
  localStorage.setItem("voteUser", JSON.stringify(user));
}

export async function login(email, password) {
  const response = await api.post("/auth/login", { email, password });
  const payload = response.data;
  saveAuth(
    {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      role: payload.role,
    },
    payload.token
  );
  return payload;
}

export async function register(data) {
  const response = await api.post("/auth/register", data);
  return response.data;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("voteUser");
}
