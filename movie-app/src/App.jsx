import HomePage from "./pages/HomePage";
import GenrePage from "./pages/GenrePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import MovieDetailsPage from "./pages/MovieDetailsPage";
import WatchlistPage from "./pages/WatchlistPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies/:id" element={<MovieDetailsPage />} />
          <Route path="/movies/genre/:genreName" element={<GenrePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}
