import { createSignal } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import { login, setCurrentUser } from '../lib/api'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = createSignal('')
  const [password, setPassword] = createSignal('')
  const [error, setError] = createSignal('')
  const [loading, setLoading] = createSignal(false)

  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const user = await login(email(), password(), true)
      setCurrentUser(user)
      localStorage.setItem('user', JSON.stringify(user))
      navigate(`/${user.blog_name}`, { replace: true })
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div class="login-page">
      <form onSubmit={handleSubmit}>
        <h1>BDSMLR</h1>
        <p class="subtitle">Sign in to your account</p>
        {error() && <p class="error">{error()}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email()}
          onInput={(e) => setEmail(e.currentTarget.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password()}
          onInput={(e) => setPassword(e.currentTarget.value)}
          required
        />
        <button type="submit" disabled={loading()}>
          {loading() ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
