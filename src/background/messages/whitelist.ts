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
> = async (req, res) => {
  let whitelist: Map<string, IWhiteRequest>

  switch (req.body.type) {
    case "get":
      whitelist = await getWhitelist()
      break

    case "put":
      if (!req.body.request) return res.send({ whitelist: {} })
      whitelist = await addToWhitelist(req.body.request)
      await requestManager.initPortSend()
      break

    case "delete":
      if (!req.body.requestKey) return res.send({ whitelist: {} })
      whitelist = await removeFromWhitelist(req.body.requestKey)
      await requestManager.initPortSend()
      break

    default:
      return res.send({ whitelist: {} })
  }

  res.send({ whitelist: Object.fromEntries(whitelist) })
}

export const getWhitelist = async (): Promise<Map<string, IWhiteRequest>> => {
  const stored = (await storage.get(STORAGE_WHITE_LIST_NAME)) as object
  return stored ? new Map(Object.entries(stored)) : new Map()
}

export const saveWhitelist = async (
  whitelist: Map<string, IWhiteRequest>
): Promise<void> => {
  await storage.set(STORAGE_WHITE_LIST_NAME, Object.fromEntries(whitelist))
}

export const addToWhitelist = async (
  req: IRequest
): Promise<Map<string, IWhiteRequest>> => {
  const whitelist = await getWhitelist()
  if (!whitelist.has(req.key)) {
    whitelist.set(req.key, { ...req })
    await saveWhitelist(whitelist)
  }
  return whitelist
}

export const removeFromWhitelist = async (
  key: string
): Promise<Map<string, IWhiteRequest>> => {
  const whitelist = await getWhitelist()
  if (whitelist.has(key)) {
    whitelist.delete(key)
    await saveWhitelist(whitelist)
  }
  return whitelist
}

export const clearWhitelist = async (): Promise<Map<string, IWhiteRequest>> => {
  await storage.clear()
  return new Map()
}

export default handler
