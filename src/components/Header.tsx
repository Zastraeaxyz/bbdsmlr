import { useNavigate, A } from '@solidjs/router'
import { getCurrentUser, setCurrentUser } from '../lib/api'

interface HeaderProps {
  info?: string
  children?: any
}

export default function Header(props: HeaderProps) {
  const navigate = useNavigate()
  const user = getCurrentUser()

  const handleSignOut = () => {
    setCurrentUser(null)
    localStorage.removeItem('user')
    navigate('/login', { replace: true })
  }

  return (
    <header>
      <h1><A href="/">BDSMLR</A></h1>
      {props.info && <span class="user-info">{props.info}</span>}
      {props.children}
      {user && (
        <button class="btn-ghost" onClick={handleSignOut}>Sign out</button>
      )}
      {!user && <A href="/login" class="btn-ghost">Sign in</A>}
    </header>
  )
}
