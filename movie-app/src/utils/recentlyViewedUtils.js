const RECENTLY_VIEWED_KEY = "recentlyViewedMovies";
const MAX_RECENTLY_VIEWED = 20;

function getCurrentUsername() {
  const stored = localStorage.getItem("username");
  if (stored) return stored;
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.username || payload.sub || null;
  } catch {
    return null;
  }
}

function getUserSpecificKey(username) {
  return `${RECENTLY_VIEWED_KEY}:${username}`;
}

export function addToRecentlyViewed(movie) {
  if (!movie || !movie.id) return;

  const username = getCurrentUsername();
  if (!username) return;

  try {
    const key = getUserSpecificKey(username);
    const stored = localStorage.getItem(key);
    let movies = stored ? JSON.parse(stored) : [];

    // Remove if already exists to move it to the front
    movies = movies.filter((m) => m.id !== movie.id);

    // Add to the beginning
    movies.unshift(movie);

    // Keep only the last 20
    movies = movies.slice(0, MAX_RECENTLY_VIEWED);

    localStorage.setItem(key, JSON.stringify(movies));
  } catch (error) {
    console.error("Error adding to recently viewed:", error);
  }
}

export function getRecentlyViewed() {
  const username = getCurrentUsername();
  if (!username) return [];

  try {
    const key = getUserSpecificKey(username);
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error getting recently viewed:", error);
    return [];
  }
}

export function clearRecentlyViewedForUser(username) {
  try {
    const key = getUserSpecificKey(username);
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error clearing recently viewed:", error);
  }
}

export function isUserLoggedIn() {
  return getCurrentUsername() !== null;
}
