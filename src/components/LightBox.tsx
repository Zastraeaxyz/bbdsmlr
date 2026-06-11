import { Show, createEffect, onCleanup } from 'solid-js'
import { getMediaType } from '../lib/sanitize'

interface LightBoxProps {
  url: string | null
  onClose: () => void
}

export function LightBox(props: LightBoxProps) {
  createEffect(() => {
    if (props.url === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') props.onClose()
    }
    window.addEventListener('keydown', handler)
    onCleanup(() => window.removeEventListener('keydown', handler))
  })

  const type = () => props.url ? getMediaType(props.url) : null

  return (
    <Show when={props.url !== null}>
      <div class="lightbox-backdrop" onClick={(e) => { if (e.target === e.currentTarget) props.onClose() }}>
        <div class="lightbox-content">
          <button type="button" class="lightbox-close" onClick={props.onClose}>
            ✕
          </button>
          <Show when={type() === 'image'} fallback={
            <video src={props.url!} muted controls preload="metadata" />
          }>
            <img src={props.url!} alt="" />
          </Show>
        </div>
      </div>
    </Show>
  )
}
