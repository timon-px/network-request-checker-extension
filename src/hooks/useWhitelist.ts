import { useCallback, useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import type { IRequest, IWhiteRequest } from "~types/IRequest"
import type { IWhiteListRequest } from "~types/IWhiteList"

interface IWhitelistHook {
  whitelist: IWhiteRequest[]
  putWhitelist: (request: IRequest) => Promise<void>
  removeWhitelist: (requestKey: string) => Promise<void>
}

const useWhitelist = (skipFetch?: boolean): IWhitelistHook => {
  const [whitelist, setWhitelist] = useState<IWhiteRequest[]>([])

  // Fetch initial whitelist
  useEffect(() => {
    if (skipFetch) return

    const fetchWhitelist = async () => {
      await processWhitelist({
        type: "get"
      })
    }

    fetchWhitelist()
  }, [])

  // Add URL to whitelist
  const putWhitelist = useCallback((request: IRequest) => {
    return processWhitelist({
      type: "put",
      request: request
    })
  }, [])

  // Remove URL from whitelist
  const removeWhitelist = useCallback((requestKey: string) => {
    return processWhitelist({
      type: "delete",
      requestKey: requestKey
    })
  }, [])

  const processWhitelist = async ({
    type,
    request,
    requestKey
  }: IWhiteListRequest) => {
    const { whitelist: response } = await sendToBackground({
      name: "whitelist",
      body: {
        type,
        request,
        requestKey
      }
    })

    const updatedWhitelist: Map<string, IWhiteRequest> = new Map(
      Object.entries(response)
    )

    setWhitelist([...updatedWhitelist.values()])
  }


  return { whitelist, putWhitelist, removeWhitelist }
}

export default useWhitelist
