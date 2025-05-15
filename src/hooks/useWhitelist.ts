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

export const useWhitelist = (skipFetch?: boolean): IWhitelistHook => {
  const [pending, setPending] = useState(true)
  const [whitelist, setWhitelist] = useState<IWhiteRequest[]>([])

  const processWhitelist = useCallback(
    async ({ type, request, requestKey }: IWhiteListRequest) => {
      const startTime = Date.now()
      setPending(true)

      try {
        const res = await sendToBackground({
          name: "whitelist",
          body: { type, request, requestKey }
        })

        const whitelistMap = new Map<string, IWhiteRequest>(
          Object.entries(res?.whitelist ?? {})
        )

        if (type === "get") await waitMinDelay(startTime)

        setWhitelist(Array.from(whitelistMap.values()))
      } finally {
        setPending(false)
      }
    },
    []
  )

  const putWhitelist = useCallback(
    (request: IRequest) => processWhitelist({ type: "put", request }),
    [processWhitelist]
  )

  const removeWhitelist = useCallback(
    (requestKey: string) => processWhitelist({ type: "delete", requestKey }),
    [processWhitelist]
  )

  // Initial fetch
  useEffect(() => {
    if (skipFetch) return
    processWhitelist({ type: "get" })
  }, [skipFetch, processWhitelist])

  return { pending, whitelist, putWhitelist, removeWhitelist }
}

export default useWhitelist
