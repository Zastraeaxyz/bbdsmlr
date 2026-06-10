import { createSignal } from 'solid-js'

interface Props {
  onFill: (query: string) => void
}

const examples = [
  { query: 'hello world', desc: 'Free text across post text fields and tags.' },
  { query: '"exact phrase"', desc: 'Phrase search across that same text space.' },
  { query: 'a & b', desc: 'Require both sides explicitly.' },
  { query: 'a | b', desc: 'Use OR explicitly.' },
  { query: '-term', desc: 'Exclude a term or group with NOT.' },
  { query: '(a | b) c', desc: 'Parentheses group boolean logic.' },
  { query: 'post:43110814', desc: 'Specific post or origin-post thread.' },
  { query: 'blog:SomeBlog', desc: 'Posting blog, scoped by Original / Reblog / All controls.' },
  { query: 'tag:latex', desc: 'Exact tag filter.' },
  { query: 'tag:"best served hot"', desc: 'Exact legacy tag with spaces.' },
  { query: 'media:image', desc: 'Media kind filter. Use | for multiple kinds.' },
  { query: 'when:2024', desc: 'Year filter. Also supports YYYY-MM and YYYY-MM-DD.' },
]

export default function SearchHelp(props: Props) {
  const [open, setOpen] = createSignal(false)

  return (
    <span class="search-help">
      <button
        type="button"
        class="search-help-btn"
        onClick={() => setOpen(!open())}
        aria-label="Search help"
      >
        ?
      </button>
      {open() && (
        <div class="search-help-dropdown">
          <p class="search-help-title">Query syntax</p>
          <p class="search-help-hint">Click an example to load it into the query field.</p>
          <div class="search-help-examples">
            {examples.map((ex) => (
              <button
                type="button"
                class="search-help-example"
                onClick={() => {
                  props.onFill(ex.query)
                  setOpen(false)
                }}
              >
                <code>{ex.query}</code>
                <span>{ex.desc}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </span>
  )
}
