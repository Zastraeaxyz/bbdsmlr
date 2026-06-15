import { createSignal, createEffect, Show, onCleanup, onMount } from 'solid-js'
import { useNavigate, A } from '@solidjs/router'
import { useAuth } from '../lib/useAuth'
import { getBlog } from '../lib/api'

const avatarCache = new Map<number, string>()

interface HeaderProps {
  info?: string
  children?: any
}

export default function Header(props: HeaderProps) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [showDropdown, setShowDropdown] = createSignal(false)
  const [avatarUrl, setAvatarUrl] = createSignal<string | null>(null)

  let containerRef: HTMLDivElement | undefined

  const handleSignOut = () => {
    setShowDropdown(false)
    logout()
    navigate('/login', { replace: true })
  }

  createEffect(() => {
    const u = user()
    if (u?.blog_id) {
      const cached = avatarCache.get(u.blog_id)
      if (cached) {
        setAvatarUrl(cached)
      } else {
        getBlog(u.blog_id).then((res) => {
          if (res.blog?.avatarUrl) {
            avatarCache.set(u.blog_id, res.blog.avatarUrl)
            setAvatarUrl(res.blog.avatarUrl)
          }
        })
      }
    }
  })

  const handleClickOutside = (e: MouseEvent) => {
    if (containerRef && !containerRef.contains(e.target as Node)) {
      setShowDropdown(false)
    }
  }

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') setShowDropdown(false)
  }

  onMount(() => {
    if (typeof document === 'undefined') return
    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleKeydown)
  })

  onCleanup(() => {
    if (typeof document === 'undefined') return
    document.removeEventListener('click', handleClickOutside)
    document.removeEventListener('keydown', handleKeydown)
  })

  return (
    <header style="view-transition-name: header">
      <h1><A href="/">BDSMLR</A></h1>
      {props.info && <span class="user-info">{props.info}</span>}
      {props.children}
      <A href="/" class="btn-ghost">Home</A>
      {user() ? (
        <div class="user-dropdown" ref={containerRef}>
          <button
            type="button"
            class="btn-ghost user-dropdown-trigger"
            onClick={() => setShowDropdown(!showDropdown())}
            aria-haspopup="true"
            aria-expanded={showDropdown()}
          >
            <Show when={avatarUrl()}>
              <img class="user-dropdown-avatar" src={avatarUrl()!} alt="" />
            </Show>
            <span>{user()!.blog_name}</span>
          </button>
          <Show when={showDropdown()}>
            <div class="user-dropdown-menu">
              <A
                href={`/${user()!.blog_name}`}
                class="user-dropdown-item"
                onClick={() => setShowDropdown(false)}
              >
                My blog
              </A>
              <A
                href="/following"
                class="user-dropdown-item"
                onClick={() => setShowDropdown(false)}
              >
                Following
              </A>
              <A
                href="/liked"
                class="user-dropdown-item"
                onClick={() => setShowDropdown(false)}
              >
                Liked
              </A>
              <button
                type="button"
                class="user-dropdown-item"
                onClick={handleSignOut}
              >
                Sign out
              </button>
            </div>
          </Show>
        </div>
      ) : (
        <A href="/login" class="btn-ghost">Sign in</A>
      )}
    </header>
  )
}
