import { createSignal, createEffect, For, Show } from 'solid-js'
import { useParams, A } from '@solidjs/router'
import { Title } from '@solidjs/meta'
import { resolveIdentifier, blogFollowGraph, type FollowEdge } from '~/lib/api'
import Header from '~/components/Header'

export default function FollowingPage() {
  const params = useParams()
  const slug = () => params.user

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
      const all: FollowEdge[] = []
      let pageToken: string | undefined
      while (true) {
        const graph = await blogFollowGraph(resolved.blogId, pageToken)
        all.push(...(graph.following || []))
        pageToken = graph.nextPageToken
        if (!pageToken) break
      }
      setFollowing(all)
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
      <main>
        <h2 style="margin-bottom:16px">Following</h2>
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
                    <Show when={f.avatarUrl}>
                      <img class="following-item-avatar" src={f.avatarUrl!} alt="" />
                    </Show>
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
