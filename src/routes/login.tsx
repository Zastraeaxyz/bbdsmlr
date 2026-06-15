import { createSignal, createEffect, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import { useAuth } from "~/lib/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { user, loading: authLoading, login: authLogin } = useAuth();

  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [error, setError] = createSignal("");
  const [submitting, setSubmitting] = createSignal(false);
  const [acknowledged, setAcknowledged] = createSignal(false);

  createEffect(() => {
    if (user() && !authLoading()) {
      navigate(`/${user()!.blog_name}`, { replace: true });
    }
  });

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const u = await authLogin(email(), password());
      navigate(`/${u.blog_name}`, { replace: true });
    } catch (err: unknown) {
      setError((err as Error)?.message || "Login failed");
    } finally {
      setSubmitting(false);
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
          <button type="submit" disabled={submitting() || !acknowledged() || authLoading()}>
            {submitting() ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </>
  );
}
