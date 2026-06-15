import { createSignal, createEffect, For, Show } from 'solid-js'
import { useParams, useLocation, A } from '@solidjs/router'
import { Title } from '@solidjs/meta'
import { resolveIdentifier, blogFollowGraph, getBlog, type FollowEdge, type Blog } from '~/lib/api'
import Header from '~/components/Header'
import { BdsmlrIcon } from '~/components/Icons'

export default function FollowingPage() {
  const params = useParams()
  const slug = () => params.user
  const location = useLocation()

  const [blog, setBlog] = createSignal<Blog | null>(null)
  const [following, setFollowing] = createSignal<FollowEdge[]>([])
  const [loading, setLoading] = createSignal(true)
  const [error, setError] = createSignal('')

  const fetchFollowing = async () => {
    const name = slug()
    if (!name) {
      setError('No user specified')
      setLoading(false)
      return
    }
    setLoading(true)
    setError('')
    try {
      const resolved = await resolveIdentifier(name)
      if (!resolved.blogId) {
        setError(resolved.error || 'User not found')
        return
      }

      const [blogRes] = await Promise.all([
        getBlog(resolved.blogId),
        (async () => {
          const all: FollowEdge[] = []
          let pageToken: string | undefined
          while (true) {
            const graph = await blogFollowGraph(resolved.blogId, pageToken)
            all.push(...(graph.following || []))
            pageToken = graph.nextPageToken
            if (!pageToken) break
          }
          setFollowing(all)
        })(),
      ])
      setBlog(blogRes.blog ?? null)
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Failed to load following')
    } finally {
      setLoading(false)
    }
  }

  createEffect(() => {
    fetchFollowing()
  })

  return (
    <div class="home-page">
      <Title>{slug()} following — bbdsmlr</Title>
      <Header info={`@${slug()}`} />
      <Show when={blog()}>
        {(b) => (
          <section class="blog-header">
            <div class="blog-header-inner">
              {b().avatarUrl && (
                <img class="blog-avatar" src={b().avatarUrl} alt="" />
              )}
              <div class="blog-header-info">
                {b().title && <h2 class="blog-title">{b().title}</h2>}
                {b().description && (
                  <p class="blog-description">{b().description}</p>
                )}
                <div style="display:flex;gap:12px;margin-top:8px">
                  <a
                    href={`https://bdsmlr.com/blog/${slug()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="download-btn"
                    title="Open on BDSMLR"
                  >
                    <BdsmlrIcon />
                  </a>
                  <A
                    href={`/${slug()}`}
                    class="download-btn"
                    classList={{ 'download-btn-active': location.pathname === `/${slug()}` }}
                    title="Feed"
                  >
                    Feed
                  </A>
                  <A
                    href={`/${slug()}/following`}
                    class="download-btn"
                    classList={{ 'download-btn-active': location.pathname === `/${slug()}/following` }}
                    title="Following"
                  >
                    Following
                  </A>
                </div>
              </div>
            </div>
          </section>
        )}
      </Show>
      <main>
        <h2 style="margin-bottom:16px">Following{!loading() ? ` (${following().length})` : ''}</h2>
        {error() && <p class="error">{error()}</p>}
        {loading() && <p class="loading">Loading…</p>}
        <Show when={!loading()}>
          <Show
            when={following().length > 0}
            fallback={<p class="empty">Not following anyone.</p>}
          >
            <div class="following-list">
              <For each={following()}>
                {(f) => (
                  <A href={`/${f.blogName}`} class="following-item">
                    <div class="following-item-avatar-wrap">
                      <Show when={f.avatarUrl} fallback={<span class="following-item-avatar-placeholder">{(f.title || f.blogName || '?')[0]}</span>}>
                        <img class="following-item-avatar" src={f.avatarUrl!} alt="" />
                      </Show>
                    </div>
                    <div class="following-item-body">
                      <span class="following-item-name">{f.title || f.blogName}</span>
                      <Show when={f.description}>
                        <span class="following-item-desc">{f.description}</span>
                      </Show>
                      <Show when={f.createdAt}>
                        <span class="following-item-meta">Created {f.createdAt}</span>
                      </Show>
                    </div>
                  </A>
                )}
              </For>
            </div>
          </Show>
        </Show>
      </main>
    </div>
  )
}
