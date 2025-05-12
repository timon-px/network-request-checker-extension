import type { IRequest, IWhiteRequest } from "~types/IRequest"

export interface IWhiteListRequest {
  type: "get" | "put" | "delete"
  request?: IRequest
  requestKey?: string
}

export interface IWhiteListResponse {
  whitelist: IRequestsWhitelist
}

export interface IRequestsWhitelist {
  [key: string]: IWhiteRequest
}
