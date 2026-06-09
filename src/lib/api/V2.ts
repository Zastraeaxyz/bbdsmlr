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

import {
  RpcStatus,
  V2BatchGetLikeStatesRequest,
  V2BatchGetLikeStatesResponse,
  V2BatchGetPostsRequest,
  V2BatchGetPostsResponse,
  V2BatchGetReblogStatesRequest,
  V2BatchGetReblogStatesResponse,
  V2GetBlockedRequest,
  V2GetBlockedResponse,
  V2GetBlogRequest,
  V2GetBlogResponse,
  V2GetPostRequest,
  V2GetPostResponse,
  V2GetTagRequest,
  V2GetTagResponse,
  V2GetUserRequest,
  V2GetUserResponse,
  V2ListBlogActivityRequest,
  V2ListBlogActivityResponse,
  V2ListBlogFollowGraphRequest,
  V2ListBlogFollowGraphResponse,
  V2ListBlogFollowsRequest,
  V2ListBlogFollowsResponse,
  V2ListBlogPostsRequest,
  V2ListBlogPostsResponse,
  V2ListBlogsRecentActivityRequest,
  V2ListBlogsRecentActivityResponse,
  V2ListPostCommentsRequest,
  V2ListPostCommentsResponse,
  V2ListPostLikesRequest,
  V2ListPostLikesResponse,
  V2ListPostReblogsRequest,
  V2ListPostReblogsResponse,
  V2ListUserActivityRequest,
  V2ListUserActivityResponse,
  V2ListUserBlogsRequest,
  V2ListUserBlogsResponse,
  V2ResolveIdentifierRequest,
  V2ResolveIdentifierResponse,
  V2SearchBlogsRequest,
  V2SearchBlogsResponse,
  V2SearchPostsByTagRequest,
  V2SearchPostsByTagResponse,
  V2SearchTagsRequest,
  V2SearchTagsResponse,
  V2SignUrlRequest,
  V2SignUrlResponse,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class V2<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags PublicReadApiV2
   * @name PublicReadApiV2BatchGetLikeStates
   * @summary Batch actor-specific like state for visible posts. The authenticated session determines the selected actor.
   * @request POST:/v2/public-read-api-v2/batch-get-like-states
   * @secure
   */
  publicReadApiV2BatchGetLikeStates = (
    body: V2BatchGetLikeStatesRequest,
    params: RequestParams = {},
  ) =>
    this.request<V2BatchGetLikeStatesResponse, RpcStatus>({
      path: `/v2/public-read-api-v2/batch-get-like-states`,
      method: "POST",
      body: body,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags PublicReadApiV2
   * @name PublicReadApiV2BatchGetPosts
   * @request POST:/v2/public-read-api-v2/batch-get-posts
   * @secure
   */
  publicReadApiV2BatchGetPosts = (
    body: V2BatchGetPostsRequest,
    params: RequestParams = {},
  ) =>
    this.request<V2BatchGetPostsResponse, RpcStatus>({
      path: `/v2/public-read-api-v2/batch-get-posts`,
      method: "POST",
      body: body,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags PublicReadApiV2
   * @name PublicReadApiV2BatchGetReblogStates
   * @request POST:/v2/public-read-api-v2/batch-get-reblog-states
   * @secure
   */
  publicReadApiV2BatchGetReblogStates = (
    body: V2BatchGetReblogStatesRequest,
    params: RequestParams = {},
  ) =>
    this.request<V2BatchGetReblogStatesResponse, RpcStatus>({
      path: `/v2/public-read-api-v2/batch-get-reblog-states`,
      method: "POST",
      body: body,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags PublicReadApiV2
   * @name PublicReadApiV2BlogFollowGraph
   * @request POST:/v2/public-read-api-v2/blog-follow-graph
   * @secure
   */
  publicReadApiV2BlogFollowGraph = (
    body: V2ListBlogFollowGraphRequest,
    params: RequestParams = {},
  ) =>
    this.request<V2ListBlogFollowGraphResponse, RpcStatus>({
      path: `/v2/public-read-api-v2/blog-follow-graph`,
      method: "POST",
      body: body,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags PublicReadApiV2
   * @name PublicReadApiV2GetBlocked
   * @summary Blocked entities for a user.
   * @request POST:/v2/public-read-api-v2/get-blocked
   * @secure
   */
  publicReadApiV2GetBlocked = (
    body: V2GetBlockedRequest,
    params: RequestParams = {},
  ) =>
    this.request<V2GetBlockedResponse, RpcStatus>({
      path: `/v2/public-read-api-v2/get-blocked`,
      method: "POST",
      body: body,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags PublicReadApiV2
   * @name PublicReadApiV2GetBlog
   * @request POST:/v2/public-read-api-v2/get-blog
   * @secure
   */
  publicReadApiV2GetBlog = (
    body: V2GetBlogRequest,
    params: RequestParams = {},
  ) =>
    this.request<V2GetBlogResponse, RpcStatus>({
      path: `/v2/public-read-api-v2/get-blog`,
      method: "POST",
      body: body,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags PublicReadApiV2
   * @name PublicReadApiV2GetPost
   * @request POST:/v2/public-read-api-v2/get-post
   * @secure
   */
  publicReadApiV2GetPost = (
    body: V2GetPostRequest,
    params: RequestParams = {},
  ) =>
    this.request<V2GetPostResponse, RpcStatus>({
      path: `/v2/public-read-api-v2/get-post`,
      method: "POST",
      body: body,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags PublicReadApiV2
   * @name PublicReadApiV2GetTag
   * @request POST:/v2/public-read-api-v2/get-tag
   * @secure
   */
  publicReadApiV2GetTag = (body: V2GetTagRequest, params: RequestParams = {}) =>
    this.request<V2GetTagResponse, RpcStatus>({
      path: `/v2/public-read-api-v2/get-tag`,
      method: "POST",
      body: body,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags PublicReadApiV2
   * @name PublicReadApiV2GetUser
   * @summary Detail endpoints.
   * @request POST:/v2/public-read-api-v2/get-user
   * @secure
   */
  publicReadApiV2GetUser = (
    body: V2GetUserRequest,
    params: RequestParams = {},
  ) =>
    this.request<V2GetUserResponse, RpcStatus>({
      path: `/v2/public-read-api-v2/get-user`,
      method: "POST",
      body: body,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags PublicReadApiV2
   * @name PublicReadApiV2ListBlogPosts
   * @summary Blog timelines (ES: posts_search).
   * @request POST:/v2/public-read-api-v2/list-blog-activity
   * @secure
   */
  publicReadApiV2ListBlogPosts = (
    body: V2ListBlogPostsRequest,
    params: RequestParams = {},
  ) =>
    this.request<V2ListBlogPostsResponse, RpcStatus>({
      path: `/v2/public-read-api-v2/list-blog-activity`,
      method: "POST",
      body: body,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags PublicReadApiV2
   * @name PublicReadApiV2ListBlogFollowers
   * @request POST:/v2/public-read-api-v2/list-blog-followers
   * @secure
   */
  publicReadApiV2ListBlogFollowers = (
    body: V2ListBlogActivityRequest,
    params: RequestParams = {},
  ) =>
    this.request<V2ListBlogActivityResponse, RpcStatus>({
      path: `/v2/public-read-api-v2/list-blog-followers`,
      method: "POST",
      body: body,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags PublicReadApiV2
   * @name PublicReadApiV2ListBlogFollowing
   * @request POST:/v2/public-read-api-v2/list-blog-following
   * @secure
   */
  publicReadApiV2ListBlogFollowing = (
    body: V2ListBlogActivityRequest,
    params: RequestParams = {},
  ) =>
    this.request<V2ListBlogActivityResponse, RpcStatus>({
      path: `/v2/public-read-api-v2/list-blog-following`,
      method: "POST",
      body: body,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags PublicReadApiV2
   * @name PublicReadApiV2ListBlogFollows
   * @request POST:/v2/public-read-api-v2/list-blog-follows
   * @secure
   */
  publicReadApiV2ListBlogFollows = (
    body: V2ListBlogFollowsRequest,
    params: RequestParams = {},
  ) =>
    this.request<V2ListBlogFollowsResponse, RpcStatus>({
      path: `/v2/public-read-api-v2/list-blog-follows`,
      method: "POST",
      body: body,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags PublicReadApiV2
   * @name PublicReadApiV2ListBlogLikes
   * @request POST:/v2/public-read-api-v2/list-blog-likes
   * @secure
   */
  publicReadApiV2ListBlogLikes = (
    body: V2ListBlogActivityRequest,
    params: RequestParams = {},
  ) =>
    this.request<V2ListBlogActivityResponse, RpcStatus>({
      path: `/v2/public-read-api-v2/list-blog-likes`,
      method: "POST",
      body: body,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags PublicReadApiV2
   * @name PublicReadApiV2ListBlogMentions
   * @request POST:/v2/public-read-api-v2/list-blog-mentions
   * @secure
   */
  publicReadApiV2ListBlogMentions = (
    body: V2ListBlogActivityRequest,
    params: RequestParams = {},
  ) =>
    this.request<V2ListBlogActivityResponse, RpcStatus>({
      path: `/v2/public-read-api-v2/list-blog-mentions`,
      method: "POST",
      body: body,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags PublicReadApiV2
   * @name PublicReadApiV2ListBlogReblogged
   * @request POST:/v2/public-read-api-v2/list-blog-reblogged
   * @secure
   */
  publicReadApiV2ListBlogReblogged = (
    body: V2ListBlogActivityRequest,
    params: RequestParams = {},
  ) =>
    this.request<V2ListBlogActivityResponse, RpcStatus>({
      path: `/v2/public-read-api-v2/list-blog-reblogged`,
      method: "POST",
      body: body,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags PublicReadApiV2
   * @name PublicReadApiV2ListBlogReblogs
   * @summary Blog-scoped activity (ES: activity index).
   * @request POST:/v2/public-read-api-v2/list-blog-reblogs
   * @secure
   */
  publicReadApiV2ListBlogReblogs = (
    body: V2ListBlogActivityRequest,
    params: RequestParams = {},
  ) =>
    this.request<V2ListBlogActivityResponse, RpcStatus>({
      path: `/v2/public-read-api-v2/list-blog-reblogs`,
      method: "POST",
      body: body,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags PublicReadApiV2
   * @name PublicReadApiV2ListBlogTopPosts
   * @request POST:/v2/public-read-api-v2/list-blog-top-posts
   * @secure
   */
  publicReadApiV2ListBlogTopPosts = (
    body: V2ListBlogPostsRequest,
    params: RequestParams = {},
  ) =>
    this.request<V2ListBlogPostsResponse, RpcStatus>({
      path: `/v2/public-read-api-v2/list-blog-top-posts`,
      method: "POST",
      body: body,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags PublicReadApiV2
   * @name PublicReadApiV2ListBlogsRecentActivity
   * @summary Bulk recent activity lookup for multiple blogs (ES-only, no SQL).
   * @request POST:/v2/public-read-api-v2/list-blogs-recent-activity
   * @secure
   */
  publicReadApiV2ListBlogsRecentActivity = (
    body: V2ListBlogsRecentActivityRequest,
    params: RequestParams = {},
  ) =>
    this.request<V2ListBlogsRecentActivityResponse, RpcStatus>({
      path: `/v2/public-read-api-v2/list-blogs-recent-activity`,
      method: "POST",
      body: body,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags PublicReadApiV2
   * @name PublicReadApiV2ListPostComments
   * @request POST:/v2/public-read-api-v2/list-post-comments
   * @secure
   */
  publicReadApiV2ListPostComments = (
    body: V2ListPostCommentsRequest,
    params: RequestParams = {},
  ) =>
    this.request<V2ListPostCommentsResponse, RpcStatus>({
      path: `/v2/public-read-api-v2/list-post-comments`,
      method: "POST",
      body: body,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags PublicReadApiV2
   * @name PublicReadApiV2ListPostLikes
   * @request POST:/v2/public-read-api-v2/list-post-likes
   * @secure
   */
  publicReadApiV2ListPostLikes = (
    body: V2ListPostLikesRequest,
    params: RequestParams = {},
  ) =>
    this.request<V2ListPostLikesResponse, RpcStatus>({
      path: `/v2/public-read-api-v2/list-post-likes`,
      method: "POST",
      body: body,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags PublicReadApiV2
   * @name PublicReadApiV2ListPostReblogs
   * @request POST:/v2/public-read-api-v2/list-post-reblogs
   * @secure
   */
  publicReadApiV2ListPostReblogs = (
    body: V2ListPostReblogsRequest,
    params: RequestParams = {},
  ) =>
    this.request<V2ListPostReblogsResponse, RpcStatus>({
      path: `/v2/public-read-api-v2/list-post-reblogs`,
      method: "POST",
      body: body,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags PublicReadApiV2
   * @name PublicReadApiV2ListUserActivity
   * @summary User activity feed (likes, comments, reblogs, posts).
   * @request POST:/v2/public-read-api-v2/list-user-activity
   * @secure
   */
  publicReadApiV2ListUserActivity = (
    body: V2ListUserActivityRequest,
    params: RequestParams = {},
  ) =>
    this.request<V2ListUserActivityResponse, RpcStatus>({
      path: `/v2/public-read-api-v2/list-user-activity`,
      method: "POST",
      body: body,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags PublicReadApiV2
   * @name PublicReadApiV2ListUserBlogs
   * @summary Relationships / lists.
   * @request POST:/v2/public-read-api-v2/list-user-blogs
   * @secure
   */
  publicReadApiV2ListUserBlogs = (
    body: V2ListUserBlogsRequest,
    params: RequestParams = {},
  ) =>
    this.request<V2ListUserBlogsResponse, RpcStatus>({
      path: `/v2/public-read-api-v2/list-user-blogs`,
      method: "POST",
      body: body,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Supply any combination of post_id, blog_id, blog_name, user_id, or user_name to map between them (name lookups are case-insensitive where supported). This endpoint is read-only and does not require a bearer token.
   *
   * @tags PublicReadApiV2
   * @name PublicReadApiV2ResolveIdentifier
   * @summary Resolve blog/post/user identifiers.
   * @request POST:/v2/public-read-api-v2/resolve-identifier
   */
  publicReadApiV2ResolveIdentifier = (
    body: V2ResolveIdentifierRequest,
    params: RequestParams = {},
  ) =>
    this.request<V2ResolveIdentifierResponse, RpcStatus>({
      path: `/v2/public-read-api-v2/resolve-identifier`,
      method: "POST",
      body: body,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags PublicReadApiV2
   * @name PublicReadApiV2SearchBlogs
   * @summary Search blogs by name/title/description. ES index: blogs. Consider multi_match on name/title/description.
   * @request POST:/v2/public-read-api-v2/search-blogs
   * @secure
   */
  publicReadApiV2SearchBlogs = (
    body: V2SearchBlogsRequest,
    params: RequestParams = {},
  ) =>
    this.request<V2SearchBlogsResponse, RpcStatus>({
      path: `/v2/public-read-api-v2/search-blogs`,
      method: "POST",
      body: body,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags PublicReadApiV2
   * @name PublicReadApiV2SearchPostsByTag
   * @summary Search posts by tag name (no full-text post search). ES index: post_tags2 -> list post_id; SQL hydrate posts.
   * @request POST:/v2/public-read-api-v2/search-posts-by-tag
   * @secure
   */
  publicReadApiV2SearchPostsByTag = (
    body: V2SearchPostsByTagRequest,
    params: RequestParams = {},
  ) =>
    this.request<V2SearchPostsByTagResponse, RpcStatus>({
      path: `/v2/public-read-api-v2/search-posts-by-tag`,
      method: "POST",
      body: body,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags PublicReadApiV2
   * @name PublicReadApiV2SearchTags
   * @summary Search tags by name. ES index: post_tags2; use composite aggregation on tag_name_norm for counts.
   * @request POST:/v2/public-read-api-v2/search-tags
   * @secure
   */
  publicReadApiV2SearchTags = (
    body: V2SearchTagsRequest,
    params: RequestParams = {},
  ) =>
    this.request<V2SearchTagsResponse, RpcStatus>({
      path: `/v2/public-read-api-v2/search-tags`,
      method: "POST",
      body: body,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags PublicReadApiV2
   * @name PublicReadApiV2SignUrl
   * @summary Sign a media URL (Bdsmlr CDN only; external links are returned unchanged).
   * @request POST:/v2/public-read-api-v2/sign-url
   * @secure
   */
  publicReadApiV2SignUrl = (
    body: V2SignUrlRequest,
    params: RequestParams = {},
  ) =>
    this.request<V2SignUrlResponse, RpcStatus>({
      path: `/v2/public-read-api-v2/sign-url`,
      method: "POST",
      body: body,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
