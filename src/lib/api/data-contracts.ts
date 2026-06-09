/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** @default "TAG_SORT_FIELD_UNSPECIFIED" */
export enum V2TagSortField {
  TAG_SORT_FIELD_UNSPECIFIED = "TAG_SORT_FIELD_UNSPECIFIED",
  TAG_SORT_FIELD_POSTS_COUNT = "TAG_SORT_FIELD_POSTS_COUNT",
  TAG_SORT_FIELD_NAME = "TAG_SORT_FIELD_NAME",
}

/** @default "POST_VARIANT_UNSPECIFIED" */
export enum V2PostVariant {
  POST_VARIANT_UNSPECIFIED = "POST_VARIANT_UNSPECIFIED",
  POST_VARIANT_ORIGINAL = "POST_VARIANT_ORIGINAL",
  POST_VARIANT_REBLOG = "POST_VARIANT_REBLOG",
}

/** @default "POST_TYPE_UNSPECIFIED" */
export enum V2PostType {
  POST_TYPE_UNSPECIFIED = "POST_TYPE_UNSPECIFIED",
  POST_TYPE_TEXT = "POST_TYPE_TEXT",
  POST_TYPE_IMAGE = "POST_TYPE_IMAGE",
  POST_TYPE_VIDEO = "POST_TYPE_VIDEO",
  POST_TYPE_AUDIO = "POST_TYPE_AUDIO",
  POST_TYPE_LINK = "POST_TYPE_LINK",
  POST_TYPE_CHAT = "POST_TYPE_CHAT",
  POST_TYPE_QUOTE = "POST_TYPE_QUOTE",
}

/**
 * - POST_SORT_FIELD_POPULAR: Alias for notes
 * @default "POST_SORT_FIELD_UNSPECIFIED"
 */
export enum V2PostSortField {
  POST_SORT_FIELD_UNSPECIFIED = "POST_SORT_FIELD_UNSPECIFIED",
  POST_SORT_FIELD_CREATED_AT = "POST_SORT_FIELD_CREATED_AT",
  POST_SORT_FIELD_LIKES_COUNT = "POST_SORT_FIELD_LIKES_COUNT",
  POST_SORT_FIELD_COMMENTS_COUNT = "POST_SORT_FIELD_COMMENTS_COUNT",
  POST_SORT_FIELD_REBLOGS_COUNT = "POST_SORT_FIELD_REBLOGS_COUNT",
  POST_SORT_FIELD_MENTIONS_COUNT = "POST_SORT_FIELD_MENTIONS_COUNT",
  POST_SORT_FIELD_NOTES_COUNT = "POST_SORT_FIELD_NOTES_COUNT",
  POST_SORT_FIELD_POPULAR = "POST_SORT_FIELD_POPULAR",
  POST_SORT_FIELD_ID = "POST_SORT_FIELD_ID",
}

/** @default "ORDER_UNSPECIFIED" */
export enum V2Order {
  ORDER_UNSPECIFIED = "ORDER_UNSPECIFIED",
  ORDER_ASC = "ORDER_ASC",
  ORDER_DESC = "ORDER_DESC",
}

/** @default "BLOG_SORT_FIELD_UNSPECIFIED" */
export enum V2BlogSortField {
  BLOG_SORT_FIELD_UNSPECIFIED = "BLOG_SORT_FIELD_UNSPECIFIED",
  BLOG_SORT_FIELD_ID = "BLOG_SORT_FIELD_ID",
  BLOG_SORT_FIELD_FOLLOWERS_COUNT = "BLOG_SORT_FIELD_FOLLOWERS_COUNT",
  BLOG_SORT_FIELD_POSTS_COUNT = "BLOG_SORT_FIELD_POSTS_COUNT",
  BLOG_SORT_FIELD_NAME = "BLOG_SORT_FIELD_NAME",
  BLOG_SORT_FIELD_CREATED_AT = "BLOG_SORT_FIELD_CREATED_AT",
}

/** @default "ACTIVITY_TYPE_UNSPECIFIED" */
export enum V2ActivityType {
  ACTIVITY_TYPE_UNSPECIFIED = "ACTIVITY_TYPE_UNSPECIFIED",
  ACTIVITY_TYPE_LIKE = "ACTIVITY_TYPE_LIKE",
  ACTIVITY_TYPE_COMMENT = "ACTIVITY_TYPE_COMMENT",
  ACTIVITY_TYPE_REBLOG = "ACTIVITY_TYPE_REBLOG",
  ACTIVITY_TYPE_POST = "ACTIVITY_TYPE_POST",
  ACTIVITY_TYPE_MENTION = "ACTIVITY_TYPE_MENTION",
  ACTIVITY_TYPE_FOLLOW = "ACTIVITY_TYPE_FOLLOW",
}

/** @default "ITEM_TYPE_UNSPECIFIED" */
export enum TimelineItemItemType {
  ITEM_TYPE_UNSPECIFIED = "ITEM_TYPE_UNSPECIFIED",
  ITEM_TYPE_POST = "ITEM_TYPE_POST",
  ITEM_TYPE_CLUSTER = "ITEM_TYPE_CLUSTER",
}

/**
 * - DIRECTION_FOLLOWING: outgoing: who this blog follows
 *  - DIRECTION_FOLLOWERS: incoming: who follows this blog
 * @default "DIRECTION_UNSPECIFIED"
 */
export enum ListBlogFollowsRequestDirection {
  DIRECTION_UNSPECIFIED = "DIRECTION_UNSPECIFIED",
  DIRECTION_FOLLOWING = "DIRECTION_FOLLOWING",
  DIRECTION_FOLLOWERS = "DIRECTION_FOLLOWERS",
}

/** New: Aggregated reblogs of the same media */
export interface PostReblogVariant {
  /** @format int64 */
  id?: string;
  blogName?: string;
}

export interface TimelineItemInteractionCluster {
  label?: string;
  interactions?: V2Post[];
}

export interface Bdsmlrv2Tag {
  /** @format int64 */
  id?: string;
  name?: string;
  /**
   * ES source: index "post_tags2".
   *  Field mapping:
   *  - id -> post_tags2.tag_id
   *  - name -> post_tags2.tag_name (or tag_name_norm)
   *  - posts_count -> terms aggregation on tag_name_norm (not stored)
   * @format int64
   */
  postsCount?: string;
}

export interface ProtobufAny {
  "@type"?: string;
  [key: string]: any;
}

export interface RpcStatus {
  /** @format int32 */
  code?: number;
  message?: string;
  details?: ProtobufAny[];
}

export interface V2Activity {
  /** @format int64 */
  id?: string;
  type?: V2ActivityType;
  /** @format int64 */
  postId?: string;
  /** @format int64 */
  blogId?: string;
  /** @format int64 */
  userId?: string;
  comment?: string;
  /**
   * ES source: index "activity".
   *  Field mapping:
   *  - id -> activity.id
   *  - type -> activity.activity_type
   *  - post_id -> activity.post_id
   *  - blog_id -> activity.blog_id
   *  - user_id -> activity.user_id
   *  - comment -> activity.comment
   *  - created_at_unix -> activity.created_at
   * Feed logic:
   *  - Use blog_ids for the user (SQL lookup).
   *  - Filter ES activity by blog_id IN (user blogs).
   *  - Sort created_at desc, paginate via search_after.
   * @format int64
   */
  createdAtUnix?: string;
}

/** Non-fatal notice for degraded/partial responses. */
export interface V2ApiWarning {
  code?: string;
  message?: string;
}

export interface V2BatchGetLikeStatesRequest {
  postIds?: string[];
  /** @format int64 */
  actingBlogId?: string;
}

export interface V2BatchGetLikeStatesResponse {
  states?: V2PostLikeState[];
}

export interface V2BatchGetPostsRequest {
  postIds?: string[];
}

export interface V2BatchGetPostsResponse {
  posts?: V2Post[];
}

export interface V2BatchGetReblogStatesRequest {
  postIds?: string[];
  /** @format int64 */
  actingBlogId?: string;
}

export interface V2BatchGetReblogStatesResponse {
  states?: V2PostReblogState[];
}

export interface V2Blog {
  /** @format int64 */
  id?: string;
  /** @format int64 */
  ownerUserId?: string;
  name?: string;
  title?: string;
  description?: string;
  avatarUrl?: string;
  coverUrl?: string;
  /** @format int64 */
  followersCount?: string;
  /** @format int64 */
  postsCount?: string;
  backgroundColor?: string;
  interests?: V2BlogPublicInterests;
  personals?: V2BlogPublicPersonals;
  /**
   * ES source: index "blogs".
   *  Field mapping:
   *  - id -> blogs.id
   *  - owner_user_id -> blogs.user_id
   *  - name -> blogs.name
   *  - title -> blogs.title
   *  - description -> blogs.description
   *  - avatar_url -> blogs.avatar (prefix with https://cdn02.bdsmlr.com/)
   *  - cover_url -> blogs.headerbg (prefix with https://cdn02.bdsmlr.com/)
   *  - followers_count -> blogs.followers
   *  - posts_count -> blogs.posts
   *  - background_color -> blogs.backgroundcolor
   */
  privacy?: V2BlogPrivacy;
}

export interface V2BlogPrivacy {
  isPrivate?: boolean;
  isPublic?: boolean;
}

export interface V2BlogPublicInterests {
  maledom?: boolean;
  femdom?: boolean;
  lesbian?: boolean;
  gay?: boolean;
  sissy?: boolean;
  latex?: boolean;
  gifs?: boolean;
  extreme?: boolean;
  vanilla?: boolean;
  vintage?: boolean;
  art?: boolean;
  funny?: boolean;
  hentai?: boolean;
  journal?: boolean;
  quotes?: boolean;
  cartoon?: boolean;
  other?: boolean;
}

export interface V2BlogPublicPersonals {
  labels?: Record<string, string>;
}

export interface V2BlogRecentActivity {
  /** @format int64 */
  blogId?: string;
  blogName?: string;
  /** @format int64 */
  latestPostId?: string;
  /** @format int64 */
  latestCreatedAtUnix?: string;
}

export interface V2Comment {
  /** @format int64 */
  id?: string;
  /** @format int64 */
  postId?: string;
  /** @format int64 */
  userId?: string;
  /** @format int64 */
  blogId?: string;
  blogName?: string;
  body?: string;
  /**
   * SQL source only (comments table).
   * @format int64
   */
  createdAtUnix?: string;
}

export interface V2CommentPostRequest {
  actor?: V2SignedActorAssertion;
  /** @format int64 */
  postId?: string;
  comment?: string;
}

export interface V2CommentPostResponse {
  ok?: boolean;
  action?: string;
  /** @format int64 */
  postId?: string;
  /** @format int64 */
  actingBlogId?: string;
  error?: V2WriteError;
}

export interface V2Content {
  /** Common fields for all post types. */
  title?: string;
  /** Plain text if available. */
  text?: string;
  /** Rich text / HTML payload. */
  html?: string;
  /** Media assets (images, audio, video). */
  files?: string[];
  /** Link target for link-type posts. */
  url?: string;
  description?: string;
  /** Type-specific optional fields. */
  quoteText?: string;
  quoteSource?: string;
  /** Preview image for media posts. */
  thumbnail?: string;
}

export interface V2DeletePostRequest {
  actor?: V2SignedActorAssertion;
  /** @format int64 */
  postId?: string;
}

export interface V2DeletePostResponse {
  ok?: boolean;
  action?: string;
  /** @format int64 */
  postId?: string;
  /** @format int64 */
  actingBlogId?: string;
  error?: V2WriteError;
}

export interface V2FollowEdge {
  /** @format int64 */
  blogId?: string;
  blogName?: string;
  /**
   * Only populated for followers (their owning user).
   * @format int64
   */
  userId?: string;
}

export interface V2GetBlockedRequest {
  /** @format int64 */
  userId?: string;
}

export interface V2GetBlockedResponse {
  blockedUserIds?: string[];
  blockedBlogIds?: string[];
}

export interface V2GetBlogRequest {
  /** @format int64 */
  blogId?: string;
}

export interface V2GetBlogResponse {
  blog?: V2Blog;
}

export interface V2GetBlogSettingsRequest {
  blogName?: string;
}

export interface V2GetBlogSettingsResponse {
  blog?: V2Blog;
}

export interface V2GetPostRequest {
  /** @format int64 */
  postId?: string;
}

export interface V2GetPostResponse {
  post?: V2Post;
}

export interface V2GetTagRequest {
  /** @format int64 */
  tagId?: string;
}

export interface V2GetTagResponse {
  tag?: Bdsmlrv2Tag;
}

export interface V2GetUserRequest {
  /** @format int64 */
  userId?: string;
}

export interface V2GetUserResponse {
  user?: V2User;
}

export interface V2GetUserSettingsRequest {
  username?: string;
}

export interface V2GetUserSettingsResponse {
  user?: V2User;
  blogs?: V2Blog[];
}

export interface V2Like {
  /** @format int64 */
  id?: string;
  /** @format int64 */
  postId?: string;
  /** @format int64 */
  userId?: string;
  /** @format int64 */
  blogId?: string;
  blogName?: string;
  /**
   * SQL source (activity table or likes table).
   * @format int64
   */
  createdAtUnix?: string;
}

export interface V2LikePostRequest {
  actor?: V2SignedActorAssertion;
  /** @format int64 */
  postId?: string;
}

export interface V2LikePostResponse {
  ok?: boolean;
  action?: string;
  /** @format int64 */
  postId?: string;
  /** @format int64 */
  actingBlogId?: string;
  state?: V2LikeState;
  error?: V2WriteError;
}

export interface V2LikeState {
  liked?: boolean;
  /** @format int64 */
  likesCount?: string;
}

export interface V2ListBlogActivityRequest {
  /** @format int64 */
  blogId?: string;
  page?: V2Pagination;
  order?: V2Order;
}

export interface V2ListBlogActivityResponse {
  activity?: V2Activity[];
  page?: V2PageInfo;
}

export interface V2ListBlogFollowGraphRequest {
  /** @format int64 */
  blogId?: string;
  /** "followers", "following", or "both" (default). */
  direction?: string;
  /**
   * Page size for ES composite agg (default 200, max 1000).
   * @format int32
   */
  pageSize?: number;
  /** Encoded composite after_key. */
  pageToken?: string;
}

export interface V2ListBlogFollowGraphResponse {
  /** @format int64 */
  blogId?: string;
  blogName?: string;
  followers?: V2FollowEdge[];
  following?: V2FollowEdge[];
  /** @format int32 */
  followersCount?: number;
  /** @format int32 */
  followingCount?: number;
  nextPageToken?: string;
}

export interface V2ListBlogFollowsRequest {
  /** @format int64 */
  blogId?: string;
  direction?: ListBlogFollowsRequestDirection;
  page?: V2Pagination;
  order?: V2Order;
}

export interface V2ListBlogFollowsResponse {
  activity?: V2Activity[];
  page?: V2PageInfo;
}

export interface V2ListBlogPostsRequest {
  /** @format int64 */
  blogId?: string;
  page?: V2Pagination;
  sortField?: V2PostSortField;
  order?: V2Order;
  postTypes?: V2PostType[];
  variants?: V2PostVariant[];
}

export interface V2ListBlogPostsResponse {
  posts?: V2Post[];
  page?: V2PageInfo;
  timelineItems?: V2TimelineItem[];
}

export interface V2ListBlogsRecentActivityRequest {
  blogIds?: string[];
  postTypes?: V2PostType[];
  variants?: V2PostVariant[];
  /** If true, return a merged global feed across the provided blog_ids, sorted by created_at (default) or notes. */
  globalMerge?: boolean;
  /** Global page/page_token when global_merge is true. */
  page?: V2Pagination;
  /** Sort field for global_merge; defaults to created_at desc. */
  sortField?: V2PostSortField;
  order?: V2Order;
  /**
   * Max items per page (cap 200) when global_merge is true.
   * @format int32
   */
  pageSize?: number;
  /**
   * Legacy per-blog limit (deprecated when global_merge=true).
   * @format int32
   */
  limitPerBlog?: number;
}

export interface V2ListBlogsRecentActivityResponse {
  items?: V2BlogRecentActivity[];
  /** When global_merge=true, items represents a flat list across all blogs and page carries the cursor. */
  page?: V2PageInfo;
}

export interface V2ListPostCommentsRequest {
  /** @format int64 */
  postId?: string;
  page?: V2Pagination;
  order?: V2Order;
}

export interface V2ListPostCommentsResponse {
  comments?: V2Comment[];
  page?: V2PageInfo;
  warnings?: V2ApiWarning[];
}

export interface V2ListPostLikesRequest {
  /** @format int64 */
  postId?: string;
  page?: V2Pagination;
  order?: V2Order;
}

export interface V2ListPostLikesResponse {
  likes?: V2Like[];
  page?: V2PageInfo;
  warnings?: V2ApiWarning[];
}

export interface V2ListPostReblogsRequest {
  /** @format int64 */
  postId?: string;
  page?: V2Pagination;
  order?: V2Order;
}

export interface V2ListPostReblogsResponse {
  reblogs?: V2Reblog[];
  page?: V2PageInfo;
  warnings?: V2ApiWarning[];
}

export interface V2ListUserActivityRequest {
  /** @format int64 */
  userId?: string;
  page?: V2Pagination;
  order?: V2Order;
}

export interface V2ListUserActivityResponse {
  activity?: V2Activity[];
  page?: V2PageInfo;
}

export interface V2ListUserBlogsRequest {
  /** @format int64 */
  userId?: string;
  page?: V2Pagination;
  sortField?: V2BlogSortField;
  order?: V2Order;
}

export interface V2ListUserBlogsResponse {
  blogs?: V2Blog[];
  page?: V2PageInfo;
}

/** --- Auth --- */
export interface V2LoginRequest {
  email?: string;
  password?: string;
}

export interface V2LoginResponse {
  accessToken?: string;
  tokenType?: string;
  /** @format int32 */
  expiresIn?: number;
}

/** --- Common --- */
export interface V2PageInfo {
  /** Opaque cursor for the next page. */
  nextPageToken?: string;
}

export interface V2Pagination {
  /**
   * Default 20; cap 100.
   * @format int32
   */
  pageSize?: number;
  /** Opaque cursor. For search-posts-by-tag this is a base64-encoded JSON of the ES composite after_key. */
  pageToken?: string;
}

export interface V2Post {
  /** @format int64 */
  id?: string;
  /** @format int64 */
  blogId?: string;
  /** @format int64 */
  originPostId?: string;
  /** @format int64 */
  originBlogId?: string;
  blogName?: string;
  originBlogName?: string;
  /** @format int64 */
  authorUserId?: string;
  type?: V2PostType;
  title?: string;
  body?: string;
  tags?: string[];
  /** @format int64 */
  createdAtUnix?: string;
  /** @format int64 */
  updatedAtUnix?: string;
  /** @format int64 */
  deletedAtUnix?: string;
  /** @format int64 */
  originDeletedAtUnix?: string;
  /** @format int64 */
  likesCount?: string;
  /** @format int64 */
  commentsCount?: string;
  /** @format int64 */
  reblogsCount?: string;
  /** @format int64 */
  mentionsCount?: string;
  /** @format int64 */
  notesCount?: string;
  content?: V2Content;
  variant?: V2PostVariant;
  reblogVariants?: PostReblogVariant[];
}

export interface V2PostLikeState {
  /** @format int64 */
  postId?: string;
  liked?: boolean;
}

export interface V2PostPresentationPolicy {
  linkAllowed?: boolean;
  clickAction?: string;
  redactionMode?: string;
  imageVariant?: string;
  /** @format float */
  visibilityFraction?: number;
  overrideReason?: string;
}

export interface V2PostReblogState {
  /** @format int64 */
  postId?: string;
  /** @format int64 */
  actorReblogCount?: string;
}

export interface V2Reblog {
  /** @format int64 */
  id?: string;
  /** @format int64 */
  postId?: string;
  /** @format int64 */
  blogId?: string;
  blogName?: string;
  /**
   * SQL source (reblogged_posts table).
   * @format int64
   */
  createdAtUnix?: string;
}

export interface V2ReblogPostRequest {
  actor?: V2SignedActorAssertion;
  /** @format int64 */
  postId?: string;
  comment?: string;
  caption?: string;
  keepComments?: boolean;
  earlier?: boolean;
  tags?: string[];
  /** @format int64 */
  typerb?: string;
}

export interface V2ReblogPostResponse {
  ok?: boolean;
  action?: string;
  /** @format int64 */
  postId?: string;
  /** @format int64 */
  actingBlogId?: string;
  error?: V2WriteError;
  /** @format int64 */
  createdReblogPostId?: string;
}

export interface V2ResolveIdentifierRequest {
  /**
   * Accept any of these; service will map to the others when possible.
   * @format int64
   */
  postId?: string;
  /** @format int64 */
  blogId?: string;
  /** Case-insensitive. */
  blogName?: string;
  /** @format int64 */
  userId?: string;
  /** Case-insensitive; only field that touches SQL (users table). */
  userName?: string;
}

export interface V2ResolveIdentifierResponse {
  /** @format int64 */
  postId?: string;
  /** @format int64 */
  blogId?: string;
  blogName?: string;
  /** @format int64 */
  userId?: string;
  userName?: string;
}

export interface V2RetrievalPageInfo {
  nextPageToken?: string;
  /** @format int32 */
  effectiveWindowLimit?: number;
  /** @format int32 */
  clearResultCount?: number;
}

/** --- Requests / responses --- */
export interface V2SearchBlogsRequest {
  query?: string;
  page?: V2Pagination;
  sortField?: V2BlogSortField;
  order?: V2Order;
}

export interface V2SearchBlogsResponse {
  blogs?: V2Blog[];
  page?: V2PageInfo;
}

export interface V2SearchPolicyContract {
  /** @format int32 */
  defaultResultWindowLimit?: number;
  /** @format int32 */
  clearResultCount?: number;
  ditherStrategy?: string;
  imageVariants?: string[];
  capabilities?: string[];
}

export interface V2SearchPostsByTagRequest {
  tagName?: string;
  page?: V2Pagination;
  sortField?: V2PostSortField;
  order?: V2Order;
  postTypes?: V2PostType[];
  blockedBlogIds?: string[];
  blockedUserIds?: string[];
  variants?: V2PostVariant[];
  perspectiveBlogName?: string;
}

export interface V2SearchPostsByTagResponse {
  posts?: V2Post[];
  page?: V2RetrievalPageInfo;
  postPolicies?: Record<string, V2PostPresentationPolicy>;
  policy?: V2SearchPolicyContract;
}

export interface V2SearchTagsRequest {
  query?: string;
  page?: V2Pagination;
  sortField?: V2TagSortField;
  order?: V2Order;
}

export interface V2SearchTagsResponse {
  tags?: Bdsmlrv2Tag[];
  page?: V2PageInfo;
}

export interface V2SignUrlRequest {
  url?: string;
}

export interface V2SignUrlResponse {
  url?: string;
}

export interface V2SignedActorAssertion {
  token?: string;
}

/** New: Unified Timeline structure for life stream */
export interface V2TimelineItem {
  type?: TimelineItemItemType;
  /** Populated if type == POST */
  post?: V2Post;
  /** Populated if type == CLUSTER */
  cluster?: TimelineItemInteractionCluster;
}

export interface V2UnlikePostRequest {
  actor?: V2SignedActorAssertion;
  /** @format int64 */
  postId?: string;
}

export interface V2UnlikePostResponse {
  ok?: boolean;
  action?: string;
  /** @format int64 */
  postId?: string;
  /** @format int64 */
  actingBlogId?: string;
  state?: V2LikeState;
  error?: V2WriteError;
}

/** --- Core entities --- */
export interface V2User {
  /** @format int64 */
  id?: string;
  username?: string;
  displayName?: string;
  /** NOTE: Users are not indexed in ES; hydrate from SQL (users table). */
  avatarUrl?: string;
}

export interface V2WriteError {
  code?: string;
  message?: string;
}
