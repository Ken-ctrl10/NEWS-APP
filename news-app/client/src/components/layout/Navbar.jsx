export default function Navbar({
  activeTab = "home",
  onTabChange,
  favoritesCount = 0,
  user,
  onLogout
}) {
  return (
    <nav className="navbar navbar-expand navbar-dark-custom px-3">
      <span className="navbar-brand fw-semibold text-light" role="button" onClick={() => onTabChange?.("home")}>
        News App
      </span>

      <div className="navbar-nav ms-auto gap-2 align-items-center flex-wrap">
        <button
          className={`btn btn-sm ${activeTab === "home" ? "btn-accent" : "btn-outline-light"}`}
          onClick={() => onTabChange?.("home")}
          type="button"
        >
          Home
        </button>

        <button
          className={`btn btn-sm ${activeTab === "search" ? "btn-accent" : "btn-outline-light"}`}
          onClick={() => onTabChange?.("search")}
          type="button"
        >
          Search
        </button>

        <button
          className={`btn btn-sm ${activeTab === "favorites" ? "btn-accent" : "btn-outline-light"}`}
          onClick={() => onTabChange?.("favorites")}
          type="button"
        >
          Favorites {favoritesCount ? <span className="badge bg-warning text-dark ms-1">{favoritesCount}</span> : null}
        </button>

        <button
          className={`btn btn-sm ${activeTab === "auth" ? "btn-accent" : "btn-outline-light"}`}
          onClick={() => onTabChange?.("auth")}
          type="button"
        >
          {user ? "Account" : "Login"}
        </button>

        {user ? (
          <>
            <span className="small opacity-75 d-none d-md-inline">
              Hi, <span className="text-warning">{user.name}</span>
            </span>
            <button className="btn btn-sm btn-outline-warning" type="button" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : null}
      </div>
    </nav>
  );
}