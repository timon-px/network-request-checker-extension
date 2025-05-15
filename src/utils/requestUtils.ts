import type { IGroupedRequest, IRequest } from "~types/IRequest"

export const getRequestKey = (request: Omit<IRequest, "key">) => {
  const { url = "", method = "", type = "" } = request
  return `${url}|${method}|${type}`
}

export const groupRequests = (requests: IRequest[]): IGroupedRequest[] => {
  const groupedMap = new Map<string, IGroupedRequest>()

  for (const request of requests) {
    if (!request || request.inWhitelist || !request.key) continue

    const { key, url, method, type, timeStamp } = request

    if (!groupedMap.has(key)) {
      groupedMap.set(key, {
        url,
        method,
        type,
        timeStamp,
        count: 0,
        requests: []
      })
    }

    const group = groupedMap.get(key)!

    group.requests.push(request)
    group.count += 1

    group.timeStamp = Math.max(group.timeStamp, request.timeStamp)
  }

  return Array.from(groupedMap.values()).sort(
    (a, b) => a.timeStamp - b.timeStamp
  )
}
