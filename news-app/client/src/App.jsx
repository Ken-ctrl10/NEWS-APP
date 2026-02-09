import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/theme.css";
import "./styles/bootstrap-overrides.css";
import "./App.css";

import { useState } from "react";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import Home from "./pages/Home";
import Search from "./pages/Search";
import Favorites from "./pages/Favorites";
import Auth from "./pages/Auth";

import useAuth from "./hooks/useAuth";
import useFavorites from "./hooks/useFavorites";

export default function App() {
  const [tab, setTab] = useState("home");

  const auth = useAuth();
  const fav = useFavorites(auth.user);

  const requireLogin = () => setTab("auth");

  const toggleFavorite = (article) => fav.toggleFavorite(article);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar
        activeTab={tab}
        onTabChange={setTab}
        favoritesCount={auth.user ? fav.favorites.length : 0}
        user={auth.user}
        onLogout={() => auth.logout()}
      />

      <main className="flex-grow-1">
        {tab === "home" ? (
          <Home
            user={auth.user}
            isFavorite={fav.isFavorite}
            onToggleFavorite={toggleFavorite}
            onRequireLogin={requireLogin}
          />
        ) : null}

        {tab === "search" ? (
          <Search
            user={auth.user}
            isFavorite={fav.isFavorite}
            onToggleFavorite={toggleFavorite}
            onRequireLogin={requireLogin}
          />
        ) : null}

        {tab === "favorites" ? (
          <Favorites
            user={auth.user}
            favorites={fav.favorites}
            isFavorite={fav.isFavorite}
            onToggleFavorite={toggleFavorite}
            onClearFavorites={fav.clearFavorites}
            onRequireLogin={requireLogin}
          />
        ) : null}

        {tab === "auth" ? (
          <Auth
            user={auth.user}
            onLogin={auth.login}
            onRegister={auth.register}
            onLogout={auth.logout}
          />
        ) : null}
      </main>

      <Footer />
    </div>
  );
}