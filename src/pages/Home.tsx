import { createSignal, createMemo } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import { requireUser, setCurrentUser, resolveIdentifier, listBlogsRecentActivity } from '../lib/api'

export default function Home() {
  const navigate = useNavigate()

  let user: ReturnType<typeof requireUser>
  try {
    user = requireUser()
  } catch {
    navigate('/login', { replace: true })
    return null
  }

  const [blogName, setBlogName] = createSignal('')
  const [rows, setRows] = createSignal<
    { blogName?: string; latestPostId?: number; latestCreatedAtUnix?: number }[]
  >()
  const [resolvedName, setResolvedName] = createSignal('')
  const [error, setError] = createSignal('')
  const [loading, setLoading] = createSignal(false)

  const handleFetch = async () => {
    const name = blogName().trim()
    if (!name) return

    setLoading(true)
    setError('')
    setRows(undefined)
    setResolvedName('')

    try {
      const resolved = await resolveIdentifier(name)
      const blogId = resolved.blogId
      if (!blogId) {
        setError('Could not resolve blog name to an ID')
        return
      }
      setResolvedName(resolved.blogName ?? name)

      const data = await listBlogsRecentActivity([blogId])
      setRows(data.items ?? [])
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  const items = createMemo(() => rows())

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') handleFetch()
  }

  const handleSignOut = () => {
    setCurrentUser(null)
    sessionStorage.removeItem('user')
    navigate('/login', { replace: true })
  }

  return (
    <div class="home-page">
      <header>
        <h1>BDSMLR</h1>
        <span class="user-info">{user.blog_name || user.username}</span>
        <button class="btn-ghost" onClick={handleSignOut}>
          Sign out
        </button>
      </header>
      <main>
        <div class="search-box">
          <input
            type="text"
            placeholder="Enter a blog name (e.g. testblog)"
            value={blogName()}
            onInput={(e) => setBlogName(e.currentTarget.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleFetch} disabled={loading() || !blogName().trim()}>
            {loading() ? 'Loading…' : 'Fetch activity'}
          </button>
        </div>

        {error() && <p class="error">{error()}</p>}

        {resolvedName() && (
          <div class="resolve-info">Resolved blog: <strong>{resolvedName()}</strong></div>
        )}

        {(() => {
          const data = items()
          if (!data) return null
          if (data.length === 0) return <p class="empty">No recent activity found.</p>
          return (
            <table>
              <thead>
                <tr>
                  <th>Blog</th>
                  <th>Latest Post ID</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr>
                    <td>{item.blogName}</td>
                    <td class="mono">{item.latestPostId ?? '—'}</td>
                    <td class="mono">
                      {item.latestCreatedAtUnix
                        ? new Date(Number(item.latestCreatedAtUnix) * 1000).toLocaleString()
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        })()}
      </main>
    </div>
  )
}
