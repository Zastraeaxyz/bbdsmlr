import { createSignal } from "solid-js";
import { useNavigate, A } from "@solidjs/router";
import { getCurrentUser, setCurrentUser, login } from "../lib/api";

function getStoredUser() {
  let user = getCurrentUser();
  if (!user) {
    try { user = JSON.parse(localStorage.getItem("user") || "null") } catch {}
  }
  return user;
}

export default function Login() {
  const navigate = useNavigate();
  const user = getStoredUser();

  if (user) {
    const handleSignOut = () => {
      setCurrentUser(null);
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
    };

    return (
      <div class="login-page">
        <div class="logged-in-card">
          <h1>BDSMLR</h1>
          <p>Logged in as <strong>{user.blog_name || user.username || user.email}</strong></p>
          <div class="login-actions">
            <A href="/" class="btn-ghost">Go to feed</A>
            <button class="btn-ghost" onClick={handleSignOut}>Sign out</button>
          </div>
        </div>
      </div>
    );
  }

  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [error, setError] = createSignal("");
  const [loading, setLoading] = createSignal(false);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const user = await login(email(), password(), true);
      setCurrentUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      navigate(`/${user.blog_name}`, { replace: true });
    } catch (err: unknown) {
      setError((err as Error)?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="login-page">
      <form onSubmit={handleSubmit}>
        <h1>BDSMLR</h1>
        <p class="subtitle">Sign in to your account</p>
        {error() && <p class="error">{error()}</p>}
        <label for="login" class="visually-hidden">
          Email or username
        </label>
        <input
          id="login"
          name="login"
          type="text"
          autocomplete="off"
          placeholder="Email or username"
          value={email()}
          onInput={(e) => setEmail(e.currentTarget.value)}
          required
        />
        <label for="password" class="visually-hidden">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autocomplete="off"
          placeholder="Password"
          value={password()}
          onInput={(e) => setPassword(e.currentTarget.value)}
          required
        />
        <button type="submit" disabled={loading()}>
          {loading() ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
