import { useEffect, useRef, useState } from "react"

import { usePort } from "@plasmohq/messaging/hook"

import type {
  IGroupedRequest,
  IRequest,
  IRequestPortRequest
} from "~types/IRequest"
import { groupRequests } from "~utils/requestUtils"
import { waitMinDelay } from "~utils/sleep"

interface IRequestListHook {
  pending: boolean
  requests: IRequest[]
  groupedRequests: IGroupedRequest[]
}

const useRequestList = (): IRequestListHook => {
  const { listen: listenRequests, send } = usePort<
    IRequestPortRequest,
    IRequest[]
  >("requests")

  const [pending, setPending] = useState<boolean>(true)
  const [requests, setRequests] = useState<IRequest[]>([])
  const [groupedRequests, setGroupedRequests] = useState<IGroupedRequest[]>([])

  const isMounted = useRef(true)
  const isFirstRun = useRef(true)

  useEffect(() => {
    isMounted.current = true

    if (isFirstRun.current) {
      send({ type: "initSend" })
    }

    const { disconnect } = listenRequests(async (requestList) => {
      if (!isMounted.current || !requestList || !Array.isArray(requestList))
        return

      const start = Date.now()
      const grouped = groupRequests(requestList)

      if (isFirstRun.current) {
        await waitMinDelay(start)
        isFirstRun.current = false
      }

      setRequests(requestList)
      setGroupedRequests(grouped)
      setPending(false)
    })

    return () => {
      isMounted.current = false
      disconnect()
    }
  }, [])

  return { pending, requests, groupedRequests }
}

export default useRequestList
