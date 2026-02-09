import useLocalStorage from "./useLocalStorage";

function getId(article) {
  return article?.url || article?.title || "";
}

export default function useFavorites(user) {
  const key = user?.id ? `newsapp:favorites:${user.id}` : "newsapp:favorites:guest";
  const [favorites, setFavorites] = useLocalStorage(key, []);

  const isFavorite = (article) => {
    const id = getId(article);
    return favorites.some((a) => getId(a) === id);
  };

  const toggleFavorite = (article) => {
    if (!user?.id) {
      const err = new Error("Please login to save favorites.");
      err.code = "authRequired";
      throw err;
    }

    const id = getId(article);
    if (!id) return;

    setFavorites((prev) => {
      const exists = prev.some((a) => getId(a) === id);
      if (exists) return prev.filter((a) => getId(a) !== id);
      return [article, ...prev];
    });
  };

  const clearFavorites = () => {
    if (!user?.id) return;
    setFavorites([]);
  };

  return { favorites, isFavorite, toggleFavorite, clearFavorites };
}