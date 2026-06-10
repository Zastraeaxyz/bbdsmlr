import { Show } from 'solid-js'
import { A } from '@solidjs/router'
import { PostVariant } from '../lib/api'

interface ReblogAttributionProps {
  originBlogName?: string
  originPostId?: number
  variant?: number
}

export function ReblogAttribution(props: ReblogAttributionProps) {
  return (
    <Show when={props.variant === PostVariant.Reblog && props.originBlogName && props.originPostId}>
      <div class="reblog-attribution">
        ↻ reblogged from{' '}
        <A href={`/${props.originBlogName}/post/${props.originPostId}`}>
          {props.originBlogName}
        </A>
      </div>
    </Show>
  )
}
