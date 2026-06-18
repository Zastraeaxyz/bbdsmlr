import { blogFollowGraph, type FollowEdge } from "./api"

const STORAGE_KEY = "following_ids"

export async function fetchAllFollowingIds(blogId: number): Promise<number[]> {
  const all: FollowEdge[] = []
  let pageToken: string | undefined
  while (true) {
    const graph = await blogFollowGraph(blogId, pageToken)
    all.push(...(graph.following || []))
    pageToken = graph.nextPageToken
    if (!pageToken) break
  }
  return all.map((f) => Number(f.blogId))
}

export function getCachedFollowingIds(): number[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function setCachedFollowingIds(ids: number[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
}

export function clearCachedFollowingIds(): void {
  localStorage.removeItem(STORAGE_KEY)
}
