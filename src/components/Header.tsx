import { useNavigate, A } from '@solidjs/router'
import { useAuth } from '../lib/useAuth'

interface HeaderProps {
  info?: string
  children?: any
}

export default function Header(props: HeaderProps) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleSignOut = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header>
      <h1><A href="/">BDSMLR</A></h1>
      {props.info && <span class="user-info">{props.info}</span>}
      {props.children}
      <A href="/" class="btn-ghost">Home</A>
      {user() && <A href={`/${user()!.blog_name}`} class="btn-ghost">My blog</A>}
      <A href="/liked" class="btn-ghost">Liked</A>
      {user() ? (
        <button class="btn-ghost" onClick={handleSignOut}>Sign out</button>
      ) : (
        <A href="/login" class="btn-ghost">Sign in</A>
      )}
    </header>
  )
}
