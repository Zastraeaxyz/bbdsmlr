import { createSignal, createEffect } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import { getCurrentUser, setCurrentUser, login } from "~/lib/api";

export default function Login() {
  const navigate = useNavigate();

  createEffect(() => {
    let user = getCurrentUser();
    if (!user) {
      try {
        user = JSON.parse(localStorage.getItem("user") || "null");
      } catch {}
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
  const [acknowledged, setAcknowledged] = createSignal(false);

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
        <div class="login-disclaimer">
          <h2>Disclaimer</h2>
          <p>
            This app is an alternative front-end to the{" "}
            <a
              href="http://bdsmlr.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              BDSMLR
            </a>{" "}
            Public API. All content displayed is not hosted by the developers of
            this front-end. Content is copyright of the original source (BDSMLR)
            and is user-provided, hosted on the API website, not on this site.
          </p>
          <p>
            This service may display user-generated adult content. By using this
            app, you acknowledge that you are of legal age to view such material
            in your jurisdiction, that the developers assume no liability for
            user-submitted content, and that you must comply with{" "}
            <a
              href="http://bdsmlr.com/terms"
              target="_blank"
              rel="noopener noreferrer"
            >
              BDSMLR's Terms of Service
            </a>
            .
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <h1>Better BDSMLR</h1>
          <p class="subtitle">Sign in to your bdsmlr.com account</p>
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
          <label class="login-ack">
            <input
              type="checkbox"
              checked={acknowledged()}
              onChange={(e) => setAcknowledged(e.currentTarget.checked)}
            />
            <span>
              By logging in here you acknowledge that the developers of this app
              own no content that is shown in this app, and that you are of legal age to view adult content in your jurisdiction.
            </span>
          </label>
          <button type="submit" disabled={loading() || !acknowledged()}>
            {loading() ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </>
  );
}
