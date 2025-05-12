export interface IRequest {
  requestId: string
  timeStamp: number
  method: string
  type: chrome.webRequest.ResourceType
  url: string

  key: string
  inWhitelist?: boolean
}

export interface IWhiteRequest {
  url: string
  method: string
  type: chrome.webRequest.ResourceType

  key: string
}

export interface IGroupedRequest {
  requests: IRequest[]
  count: number

  timeStamp: number
  method: string
  type: chrome.webRequest.ResourceType
  url: string
}

export interface IRequestsByTab {
  [key: number]: IRequest[]
}

export interface IRequestPortRequest {
  type: "initSend"
  requests?: IRequest[]
}
