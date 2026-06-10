import { Show, createEffect, onCleanup } from 'solid-js'

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

  return (
    <Show when={props.url !== null}>
      <div class="lightbox-backdrop" onClick={(e) => { if (e.target === e.currentTarget) props.onClose() }}>
        <div class="lightbox-content">
          <button type="button" class="lightbox-close" onClick={props.onClose}>
            ✕
          </button>
          <div class="media-shell">
            <img
              src={props.url!}
              alt=""
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
            <video
              src={props.url!}
              muted
              controls
              playsinline
              loop
              preload="metadata"
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
          </div>
        </div>
      </div>
    </Show>
  )
}
