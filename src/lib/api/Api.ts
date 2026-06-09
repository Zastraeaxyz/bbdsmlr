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
  V2CommentPostRequest,
  V2CommentPostResponse,
  V2DeletePostRequest,
  V2DeletePostResponse,
  V2GetBlogSettingsRequest,
  V2GetBlogSettingsResponse,
  V2GetUserSettingsRequest,
  V2GetUserSettingsResponse,
  V2LikePostRequest,
  V2LikePostResponse,
  V2LoginRequest,
  V2LoginResponse,
  V2ReblogPostRequest,
  V2ReblogPostResponse,
  V2UnlikePostRequest,
  V2UnlikePostResponse,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Api<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description Short-lived bearer token for subsequent API calls.
   *
   * @tags Auth
   * @name AuthLogin
   * @summary Authenticate and receive a bearer token.
   * @request POST:/api/v2/auth/login
   */
  authLogin = (body: V2LoginRequest, params: RequestParams = {}) =>
    this.request<V2LoginResponse, RpcStatus>({
      path: `/api/v2/auth/login`,
      method: "POST",
      body: body,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags AuthApiV2
   * @name AuthApiV2GetBlogSettings
   * @request POST:/api/v2/auth/settings/blog
   * @secure
   */
  authApiV2GetBlogSettings = (
    body: V2GetBlogSettingsRequest,
    params: RequestParams = {},
  ) =>
    this.request<V2GetBlogSettingsResponse, RpcStatus>({
      path: `/api/v2/auth/settings/blog`,
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
   * @tags AuthApiV2
   * @name AuthApiV2GetUserSettings
   * @request POST:/api/v2/auth/settings/user
   * @secure
   */
  authApiV2GetUserSettings = (
    body: V2GetUserSettingsRequest,
    params: RequestParams = {},
  ) =>
    this.request<V2GetUserSettingsResponse, RpcStatus>({
      path: `/api/v2/auth/settings/user`,
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
   * @tags InternalWriteApiV2
   * @name InternalWriteApiV2CommentPost
   * @request POST:/api/v2/internal-write/comment
   * @secure
   */
  internalWriteApiV2CommentPost = (
    body: V2CommentPostRequest,
    params: RequestParams = {},
  ) =>
    this.request<V2CommentPostResponse, RpcStatus>({
      path: `/api/v2/internal-write/comment`,
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
   * @tags InternalWriteApiV2
   * @name InternalWriteApiV2DeletePost
   * @request POST:/api/v2/internal-write/delete
   * @secure
   */
  internalWriteApiV2DeletePost = (
    body: V2DeletePostRequest,
    params: RequestParams = {},
  ) =>
    this.request<V2DeletePostResponse, RpcStatus>({
      path: `/api/v2/internal-write/delete`,
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
   * @tags InternalWriteApiV2
   * @name InternalWriteApiV2LikePost
   * @request POST:/api/v2/internal-write/like
   * @secure
   */
  internalWriteApiV2LikePost = (
    body: V2LikePostRequest,
    params: RequestParams = {},
  ) =>
    this.request<V2LikePostResponse, RpcStatus>({
      path: `/api/v2/internal-write/like`,
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
   * @tags InternalWriteApiV2
   * @name InternalWriteApiV2ReblogPost
   * @request POST:/api/v2/internal-write/reblog
   * @secure
   */
  internalWriteApiV2ReblogPost = (
    body: V2ReblogPostRequest,
    params: RequestParams = {},
  ) =>
    this.request<V2ReblogPostResponse, RpcStatus>({
      path: `/api/v2/internal-write/reblog`,
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
   * @tags InternalWriteApiV2
   * @name InternalWriteApiV2UnlikePost
   * @request POST:/api/v2/internal-write/unlike
   * @secure
   */
  internalWriteApiV2UnlikePost = (
    body: V2UnlikePostRequest,
    params: RequestParams = {},
  ) =>
    this.request<V2UnlikePostResponse, RpcStatus>({
      path: `/api/v2/internal-write/unlike`,
      method: "POST",
      body: body,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
