import Skeleton from "@elements/Skeleton"
import WhitelistItem from "@elements/WhitelistItem"
import { AnimatePresence } from "framer-motion"
import { useCallback } from "react"

import useWhitelist from "~hooks/useWhitelist"

import style from "./style.module.scss"

const WhiteList = () => {
  const { pending, whitelist, removeWhitelist } = useWhitelist()

  const onRemoveHandle = useCallback(
    async (requestKey: string) => {
      await removeWhitelist(requestKey)
    },
    [removeWhitelist]
  )

  if (pending && whitelist.length < 1) {
    return (
      <ul className={style.whitelist}>
        <Skeleton />
      </ul>
    )
  }

  if (!whitelist || whitelist.length < 1) {
    return (
      <h2 className={style.whitelist_empty}>
        There is no requests in whitelist
      </h2>
    )
  }

  return (
    <ul className={style.whitelist}>
      <AnimatePresence>
        {whitelist.map((value) => (
          <WhitelistItem
            key={value.key}
            requestKey={value.key}
            handleRemove={onRemoveHandle}
            {...value}
          />
        ))}
      </AnimatePresence>
    </ul>
  )
}

export default WhiteList
