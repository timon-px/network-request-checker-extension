import RequestItem from "@elements/RequestItem"
import Skeleton from "@elements/Skeleton"
import { AnimatePresence } from "framer-motion"
import { useCallback } from "react"

import useRequestList from "~hooks/useRequestList"
import useWhitelist from "~hooks/useWhitelist"
import type { IRequest } from "~types/IRequest"

import style from "./style.module.scss"

const RequestList = () => {
  const { pending, groupedRequests } = useRequestList()
  const { putWhitelist } = useWhitelist(true)

  const onWhitelistHandle = useCallback(
    async (request: IRequest) => {
      await putWhitelist(request)
    },
    [putWhitelist]
  )

  if (pending && groupedRequests.length < 1) {
    return (
      <ul className={style.request_list}>
        <Skeleton amount={2} />
      </ul>
    )
  }

  if (!groupedRequests || groupedRequests.length < 1) {
    return (
      <h2 className={style.request_list_empty}>
        There is no external requests on current page
      </h2>
    )
  }

  return (
    <ul className={style.request_list}>
      <AnimatePresence>
        {groupedRequests.map((value) => (
          <RequestItem
            key={value.url}
            handleWhitelist={onWhitelistHandle}
            {...value}
          />
        ))}
      </AnimatePresence>
    </ul>
  )
}

export default RequestList
