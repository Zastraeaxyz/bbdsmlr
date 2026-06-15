import { createEffect } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import { useAuth } from '~/lib/useAuth'

export default function FollowingRedirect() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()

  createEffect(() => {
    if (loading()) return
    if (!user()) {
      navigate('/login', { replace: true })
    } else {
      navigate(`/${user()!.blog_name}/following`, { replace: true })
    }
  })

  return null
}
