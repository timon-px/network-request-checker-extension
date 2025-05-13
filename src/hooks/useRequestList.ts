import { useEffect, useState } from "react"

import { usePort } from "@plasmohq/messaging/hook"

import type {
  IGroupedRequest,
  IRequest,
  IRequestPortRequest
} from "~types/IRequest"
import { groupRequests } from "~utils/requestUtils"

interface IRequestListHook {
  requests: IRequest[]
  groupedRequests: IGroupedRequest[]
}

const useRequestList = (): IRequestListHook => {
  const { listen: listenRequests, send } = usePort<
    IRequestPortRequest,
    IRequest[]
  >("requests")

  const [requests, setRequests] = useState<IRequest[]>([])
  const [groupedRequests, setGroupedRequests] = useState<IGroupedRequest[]>([])

  useEffect(() => {
    if (requests.length < 1) send({ type: "initSend" })

    listenRequests(async (requestList) => {
      if (!requestList) return
      const groupedRequestList = groupRequests(requestList)

      setRequests(requestList)
      setGroupedRequests(groupedRequestList)
    })
  }, [])

  return { requests, groupedRequests }
}

export default useRequestList
