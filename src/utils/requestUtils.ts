import type { IGroupedRequest, IRequest } from "~types/IRequest"

export const getRequestKey = (request: Omit<IRequest, "key">) => {
  return `${request.url}|${request.method}|${request.type}`
}

export const groupRequests = (requests: IRequest[]): IGroupedRequest[] => {
  const groupedMap = requests.reduce((map, request) => {
    if (!request || request.inWhitelist) return map

    if (!map.has(request.key)) {
      map.set(request.key, {
        url: request.url,
        method: request.method,
        type: request.type,
        timeStamp: request.timeStamp,
        count: 0,
        requests: []
      })
    }

    const group = map.get(request.key)
    group.requests.push(request)

    group.count = group.requests.length
    group.timeStamp = Math.max(group.timeStamp, request.timeStamp)

    return map
  }, new Map<string, IGroupedRequest>())

  return Array.from(groupedMap.values()).sort(
    (left, right) => left.timeStamp - right.timeStamp
  )
}
