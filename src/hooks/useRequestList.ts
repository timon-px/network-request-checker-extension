import { useEffect, useState } from "react"

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

  useEffect(() => {
    if (requests.length < 1) send({ type: "initSend" })

    listenRequests(async (requestList) => {
      const startTime = Date.now()

      if (!requestList) return
      const groupedRequestList = groupRequests(requestList)

      await waitMinDelay(startTime)

      setRequests(requestList)
      setGroupedRequests(groupedRequestList)
      setPending(false)
    })
  }, [])

  return { pending, requests, groupedRequests }
}

export default useRequestList
