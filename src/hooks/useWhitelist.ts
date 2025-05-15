import { useCallback, useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import type { IRequest, IWhiteRequest } from "~types/IRequest"
import type { IWhiteListRequest } from "~types/IWhiteList"
import { waitMinDelay } from "~utils/sleep"

interface IWhitelistHook {
  pending: boolean
  whitelist: IWhiteRequest[]
  putWhitelist: (request: IRequest) => Promise<void>
  removeWhitelist: (requestKey: string) => Promise<void>
}

const useWhitelist = (skipFetch?: boolean): IWhitelistHook => {
  const [pending, setPending] = useState<boolean>(true)
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
    const startTime = Date.now()

    setPending(true)

    try {
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

      await waitMinDelay(startTime)

      setWhitelist([...updatedWhitelist.values()])
    } finally {
      setPending(false)
    }
  }

  return { pending, whitelist, putWhitelist, removeWhitelist }
}

export default useWhitelist
