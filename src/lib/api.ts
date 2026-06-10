const API_BASE = '/v2/api'
const AUTH_BASE = '/v2/api/auth'

export interface AuthUser {
  user_id: number
  blog_id: number | null
  blog_name?: string | null
  username?: string | null
  blogs?: { id: number; name: string; user_id?: number }[]
  primary_blog_id?: number | null
  email?: string
}

let currentUser: AuthUser | null = null

export function getCurrentUser(): AuthUser | null {
  return currentUser
}

export function setCurrentUser(user: AuthUser | null) {
  currentUser = user
}

export function requireUser(): AuthUser {
  const user = currentUser || JSON.parse(localStorage.getItem('user') || 'null')
  if (!user) throw new Error('Not authenticated')
  currentUser = user
  return user
}

export interface ResolveIdentifierResponse {
  blogId?: number
  blogName?: string
  postId?: number | null
  userId?: number
  userName?: string | null
  error?: string
}

export interface RecentActivityItem {
  blogId?: number
  blogName?: string
  latestPostId?: number
  latestCreatedAtUnix?: number
}

export interface ListBlogsRecentActivityResponse {
  items?: RecentActivityItem[]
  posts?: Post[]
  page?: { nextPageToken?: string }
  error?: string
}

export interface FollowEdge {
  blogId: string
  blogName: string
  userId?: string
}

export interface BlogFollowGraphResponse {
  blogId?: string
  blogName?: string
  followers?: FollowEdge[]
  following?: FollowEdge[]
  followersCount?: number
  followingCount?: number
  nextPageToken?: string
  error?: string
}

export function blogFollowGraph(blogId: number) {
  return request<BlogFollowGraphResponse>(API_BASE, '/blog-follow-graph', {
    blogId: String(blogId),
    direction: 'following',
  })
}

async function request<T>(base: string, path: string, body: unknown): Promise<T> {
  const res = await fetch(`${base}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    credentials: 'include',
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(err.message || err.error || `HTTP ${res.status}`)
  }

  return res.json()
}

export function login(login: string, password: string, remember = false) {
  return request<AuthUser>(AUTH_BASE, '/login', { login, password, remember })
}

export function resolveIdentifier(blogName: string) {
  return request<ResolveIdentifierResponse>(API_BASE, '/resolve-identifier', { blog_name: blogName })
}

export function listBlogsRecentActivity(blogIds: number[], pageSize = 20) {
  return request<ListBlogsRecentActivityResponse>(API_BASE, '/list-blogs-recent-activity', {
    blog_ids: blogIds,
    global_merge: true,
    page: { page_size: pageSize },
  })
}

export interface PostContent {
  files?: string[]
  thumbnail?: string
  html?: string
  text?: string
  title?: string
  url?: string
  quoteText?: string
  quoteSource?: string
}

export interface Post {
  id: number
  blogId?: number
  blogName?: string
  type?: number
  title?: string
  body?: string
  content?: PostContent
  tags?: string[]
  likesCount?: number
  commentsCount?: number
  reblogsCount?: number
  createdAtUnix?: number
}

export interface ListBlogActivityRequest {
  blog_id: number
  blog_name?: string
  sort_field?: number
  order?: number
  post_types?: number[]
  activity_kinds?: string[]
  page?: number
  page_size?: number
}

export interface ListBlogActivityResponse {
  posts?: Post[]
  timelineItems?: { type: number; post?: Post }[]
  page?: { nextPageToken?: string }
  error?: string
}

export function listBlogActivity(req: ListBlogActivityRequest) {
  return request<ListBlogActivityResponse>(API_BASE, '/list-blog-activity', req)
}

export async function signUrl(url: string): Promise<string> {
  const data = await request<{ url?: string }>(API_BASE, '/sign-url', { url })
  return data.url || url
}

export interface GetPostDetailResponse {
  post?: Post
  error?: string
}

export function getPostDetail(postId: number) {
  return request<GetPostDetailResponse>(API_BASE, '/get-post-detail', { post_id: postId })
}

export interface TopTag {
  tag: string
  count: number
}

export interface ListBlogTopTagsResponse {
  tags?: TopTag[]
  error?: string
}

export function listBlogTopTags(blogName: string, pageSize = 150) {
  return request<ListBlogTopTagsResponse>(API_BASE, '/list-blog-top-tags', {
    blog_name: blogName,
    page_size: pageSize,
  })
}

