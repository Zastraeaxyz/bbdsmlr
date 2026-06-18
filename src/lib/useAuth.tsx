import { createContext, createSignal, createEffect, useContext, onCleanup, type ParentProps } from "solid-js"
import { getCurrentUser, setCurrentUser, login as apiLogin, type AuthUser } from "./api"
import { fetchAllFollowingIds, setCachedFollowingIds, clearCachedFollowingIds } from "./following"

interface AuthContextType {
  user: () => AuthUser | null
  loading: () => boolean
  login: (email: string, password: string) => Promise<AuthUser>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>()

export function AuthProvider(props: ParentProps) {
  const [user, setUser] = createSignal<AuthUser | null>(getCurrentUser())
  const [loading, setLoading] = createSignal(true)

  let cancelled = false
  onCleanup(() => { cancelled = true })

  createEffect(() => {
    let u = user()
    if (!u) {
      try {
        const stored = localStorage.getItem("user")
        if (stored) {
          u = JSON.parse(stored)
          setCurrentUser(u)
          setUser(u)
        }
      } catch {}
    }
    if (!cancelled) setLoading(false)
  })

  const login = async (email: string, password: string) => {
    const u = await apiLogin(email, password, true)
    setCurrentUser(u)
    localStorage.setItem("user", JSON.stringify(u))
    setUser(u)
    if (u.blog_id) {
      try {
        const ids = await fetchAllFollowingIds(u.blog_id)
        setCachedFollowingIds(ids)
      } catch {}
    }
    return u
  }

  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem("user")
    clearCachedFollowingIds()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider")
  return ctx
}
