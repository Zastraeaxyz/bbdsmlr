import { createSignal, createEffect, For, Show } from 'solid-js'
import { useParams, A } from '@solidjs/router'
import { Title } from '@solidjs/meta'
import { resolveIdentifier, blogFollowGraph, getBlog, type FollowEdge, type Blog } from '~/lib/api'
import Header from '~/components/Header'

export default function FollowingPage() {
  const params = useParams()
  const slug = () => params.user

  const [following, setFollowing] = createSignal<FollowEdge[]>([])
  const [blogs, setBlogs] = createSignal<Record<string, Blog>>({})
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

      const blogMap: Record<string, Blog> = {}
      await Promise.all(all.map(async (f) => {
        try {
          const res = await getBlog(Number(f.blogId))
          if (res.blog) blogMap[f.blogId] = res.blog
        } catch {}
      }))
      setBlogs(blogMap)
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
                {(f) => {
                  const b = blogs()[f.blogId]
                  return (
                    <A href={`/${f.blogName}`} class="following-item">
                      <Show when={b?.avatarUrl}>
                        <img class="following-item-avatar" src={b!.avatarUrl!} alt="" />
                      </Show>
                      <div class="following-item-body">
                        <span class="following-item-name">{b?.title || f.blogName}</span>
                        <Show when={b?.description}>
                          <span class="following-item-desc">{b!.description}</span>
                        </Show>
                        <Show when={b?.createdAt}>
                          <span class="following-item-meta">Created {b!.createdAt}</span>
                        </Show>
                      </div>
                    </A>
                  )
                }}
              </For>
            </div>
          </Show>
        </Show>
      </main>
    </div>
  )
}
