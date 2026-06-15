import { createSignal, createEffect } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import { getCurrentUser, setCurrentUser, login } from "~/lib/api";

export default function Login() {
  const navigate = useNavigate();

  createEffect(() => {
    let user = getCurrentUser();
    if (!user) {
      try { user = JSON.parse(localStorage.getItem("user") || "null") } catch {}
    }
    if (user) {
      setCurrentUser(user);
      navigate(`/${user.blog_name}`, { replace: true });
    }
  });

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
    <>
      <Title>Sign in — bbdsmlr</Title>
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
    </>
  );
}
