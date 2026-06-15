export function HeartIcon(props: { class?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width={1.5}
      stroke="currentColor"
      class={props.class ?? "icon"}
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
      />
    </svg>
  )
}

export function ChatIcon(props: { class?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width={1.5}
      stroke="currentColor"
      class={props.class ?? "icon"}
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
      />
    </svg>
  )
}

export function ReblogIcon(props: { class?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width={1.5}
      stroke="currentColor"
      class={props.class ?? "icon"}
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"
      />
    </svg>
  )
}

export function BdsmlrIcon(props: { class?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 16 16"
      class={props.class ?? "icon"}
    >
      <path d="M0 0 C5.28 0 10.56 0 16 0 C16 5.28 16 10.56 16 16 C10.72 16 5.44 16 0 16 C0 10.72 0 5.44 0 0 Z " fill="#4F4F4F" transform="translate(0,0)"/>
      <path d="M0 0 C0.99 0 1.98 0 3 0 C3 2.64 3 5.28 3 8 C3.66 7.67 4.32 7.34 5 7 C4.67 5.68 4.34 4.36 4 3 C5.32 3.33 6.64 3.66 8 4 C8.33 5.65 8.66 7.3 9 9 C6 11 6 11 3.375 10.6875 C1 10 1 10 0 9 C-0.07179964 7.48071962 -0.08392007 5.95832518 -0.0625 4.4375 C-0.05347656 3.61121094 -0.04445312 2.78492188 -0.03515625 1.93359375 C-0.02355469 1.29550781 -0.01195312 0.65742187 0 0 Z " fill="#EEEEEE" transform="translate(4,3)"/>
    </svg>
  )
}

export function DownloadIcon(props: { class?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width={1.5}
      stroke="currentColor"
      class={props.class ?? "icon"}
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
      />
    </svg>
  )
}
