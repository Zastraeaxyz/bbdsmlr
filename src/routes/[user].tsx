import { createSignal, createEffect, Show, type ParentProps } from 'solid-js'
import { useParams, useLocation, A } from '@solidjs/router'
import { Title } from '@solidjs/meta'
import { resolveIdentifier, getBlog, type Blog } from '~/lib/api'
import Header from '~/components/Header'
import { BdsmlrIcon } from '~/components/Icons'

export default function UserLayout(props: ParentProps) {
  const params = useParams()
  const slug = () => params.user
  const location = useLocation()

  const [blog, setBlog] = createSignal<Blog | null>(null)
  const [loading, setLoading] = createSignal(true)
  const [error, setError] = createSignal('')

  createEffect(() => {
    const name = slug()
    if (!name) return
    setLoading(true)
    setError('')
    resolveIdentifier(name).then((resolved) => {
      if (!resolved.blogId) {
        setError(resolved.error || 'User not found')
        setLoading(false)
        return
      }
      getBlog(resolved.blogId).then((res) => {
        setBlog(res.blog ?? null)
        setLoading(false)
      })
    })
  })

  return (
    <div class="home-page">
      <Title>{slug()} — bbdsmlr</Title>
      <Header info={`@${slug()}`} />
      {error() && <p class="error">{error()}</p>}
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
      {props.children}
    </div>
  )
}
