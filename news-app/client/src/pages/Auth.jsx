import { useState } from "react";

export default function Auth({ user, onLogin, onRegister, onLogout }) {
  const [mode, setMode] = useState("login"); // login | register
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        await onRegister?.({ name, email, password });
      } else {
        await onLogin?.({ email, password });
      }

      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div className="container py-4">
        <div className="card card-surface p-4">
          <h4 className="mb-2">You are logged in ✅</h4>
          <p className="opacity-75 mb-3">
            Welcome, <span className="text-warning">{user.name}</span> ({user.email})
          </p>
          <button className="btn btn-outline-light" onClick={onLogout} type="button">
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4" style={{ maxWidth: 520 }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="m-0">{mode === "register" ? "Register" : "Login"}</h3>

        <button
          className="btn btn-outline-light btn-sm"
          type="button"
          onClick={() => setMode((m) => (m === "login" ? "register" : "login"))}
        >
          Switch to {mode === "login" ? "Register" : "Login"}
        </button>
      </div>

      {error ? <div className="alert alert-danger">{error}</div> : null}

      <form onSubmit={submit} className="card card-surface p-4 d-grid gap-3">
        {mode === "register" ? (
          <div>
            <label className="form-label">Name</label>
            <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </div>
        ) : null}

        <div>
          <label className="form-label">Email</label>
          <input className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@email.com" />
        </div>

        <div>
          <label className="form-label">Password</label>
          <input
            className="form-control"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min 6 characters"
          />
        </div>

        <button className="btn btn-accent" disabled={loading} type="submit">
          {loading ? "Please wait..." : mode === "register" ? "Create Account" : "Login"}
        </button>

        <div className="small opacity-75">
          * This is a demo auth stored in localStorage (no backend DB yet).
        </div>
      </form>
    </div>
  );
}