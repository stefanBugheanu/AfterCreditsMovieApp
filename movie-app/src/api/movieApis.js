import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

axios.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("token");
      window.dispatchEvent(new Event("authChange"));
    }
    return Promise.reject(err);
  },
);

export async function getMovies() {
  const res = await axios.get(`${BASE_URL}/movies`);
  return res.data;
}

export async function getTopRatedMovies() {
  const res = await axios.get(`${BASE_URL}/movies/topRated`);
  return res.data;
}

export async function getMoviesByGenre(genre) {
  const res = await axios.get(`${BASE_URL}/movies/genre/topRated/${genre}`);
  return res.data;
}

export async function getAllGenres() {
  const res = await axios.get(`${BASE_URL}/movies/genres`);
  return res.data;
}

export async function register(registerRequest) {
  const res = await axios.post(`${BASE_URL}/auth/register`, registerRequest);
  return res.data;
}

export async function login(loginRequest) {
  const res = await axios.post(`${BASE_URL}/auth/login`, loginRequest);
  return res.data;
}
export async function getUserStats() {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${BASE_URL}/user/me/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function getMovieById(id) {
  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await axios.get(`${BASE_URL}/movies/${id}`, { headers });
  return res.data;
}

export async function addRatingToMovie(movieId, value) {
  const token = localStorage.getItem("token");
  const res = await axios.post(`${BASE_URL}/ratings/${movieId}`, null, {
    params: { value },
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function addReviewToMovie(movieId, content) {
  const token = localStorage.getItem("token");
  const res = await axios.post(
    `${BASE_URL}/reviews/${movieId}`,
    { content },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return res.data;
}

export async function getWatchlist() {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${BASE_URL}/watchlist`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (Array.isArray(res.data)) return res.data;
  return res.data?.content ?? [];
}

export async function addToWatchlist(movieId) {
  const token = localStorage.getItem("token");
  const res = await axios.post(
    `${BASE_URL}/watchlist`,
    { movieId },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return res.data;
}

export async function removeFromWatchlist(movieId) {
  const token = localStorage.getItem("token");
  const res = await axios.delete(`${BASE_URL}/watchlist/${movieId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
