import type { PlasmoMessaging } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

import { requestManager } from "~background"
import type { IRequest, IWhiteRequest } from "~types/IRequest"
import type { IWhiteListRequest, IWhiteListResponse } from "~types/IWhiteList"

const storage = new Storage({ area: "sync" })
const STORAGE_WHITE_LIST_NAME = "whitelist"

const handler: PlasmoMessaging.MessageHandler<
  IWhiteListRequest,
  IWhiteListResponse
> = async (request, response) => {
  let whitelist = new Map<string, IWhiteRequest>()

  const { request: webRequest, requestKey } = request.body

  if (request.body.type === "get") {
    whitelist = await getWhitelist()
  } else if (request.body.type === "put" && webRequest) {
    whitelist = await putWhitelist(webRequest)
    await requestManager.initPortSend()
  } else if (request.body.type === "delete" && requestKey) {
    whitelist = await removeWhitelist(requestKey)
    await requestManager.initPortSend()
  }

  response.send({ whitelist: Object.fromEntries(whitelist) })
}

export const getWhitelist = async (): Promise<Map<string, IWhiteRequest>> => {
  const result = (await storage.get(STORAGE_WHITE_LIST_NAME)) as object

  if (!result) {
    const initMap = new Map<string, IWhiteRequest>()
    await storage.set(STORAGE_WHITE_LIST_NAME, Object.fromEntries(initMap))
    return initMap
  }

  return new Map(Object.entries(result))
}

export const putWhitelist = async (
  request: IRequest
): Promise<Map<string, IWhiteRequest>> => {
  const whitelist = await getWhitelist()
  if (whitelist.has(request.key)) return whitelist

  whitelist.set(request.key, { ...request })
  await storage.set(STORAGE_WHITE_LIST_NAME, Object.fromEntries(whitelist))

  return whitelist
}

export const removeWhitelist = async (
  requestKey: string
): Promise<Map<string, IWhiteRequest>> => {
  const whitelist = await getWhitelist()
  if (!whitelist.has(requestKey)) return whitelist

  whitelist.delete(requestKey)
  await storage.set(STORAGE_WHITE_LIST_NAME, Object.fromEntries(whitelist))

  return whitelist
}

export const cleanWhitelist = async (): Promise<Map<string, IWhiteRequest>> => {
  await storage.clear()
  return await getWhitelist()
}

export default handler
