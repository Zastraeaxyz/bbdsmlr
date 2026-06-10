import { Show } from 'solid-js'
import { A } from '@solidjs/router'
import { PostVariant } from '../lib/api'

interface ReblogAttributionProps {
  originBlogName?: string
  variant?: number
}

export function ReblogAttribution(props: ReblogAttributionProps) {
  return (
    <Show when={props.variant === PostVariant.Reblog && props.originBlogName}>
      <div class="reblog-attribution">
        ↻ reblogged from <A href={`/${props.originBlogName}`}>{props.originBlogName}</A>
      </div>
    </Show>
  )
}
