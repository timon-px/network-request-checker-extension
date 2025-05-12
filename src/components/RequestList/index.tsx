import RequestItem from "@elements/RequestItem"
import { useCallback } from "react"

import useRequestList from "~hooks/useRequestList"
import useWhitelist from "~hooks/useWhitelist"
import type { IRequest } from "~types/IRequest"

import style from "./style.module.scss"

const RequestList = () => {
  const { groupedRequests } = useRequestList()
  const { putWhitelist } = useWhitelist(true)

  const onWhitelistHandle = useCallback(
    async (request: IRequest) => {
      await putWhitelist(request)
    },
    [putWhitelist]
  )

  if (!groupedRequests || groupedRequests.length < 1) {
    return (
      <h2 className={style.request_list_empty}>
        There is no external requests on current page
      </h2>
    )
  }

  return (
    <ul className={style.request_list}>
      {groupedRequests.map((value) => (
        <RequestItem
          key={value.url}
          handleWhitelist={onWhitelistHandle}
          {...value}
        />
      ))}
    </ul>
  )
}

export default RequestList
