import WhitelistItem from "@elements/WhitelistItem"
import { useCallback } from "react"

import useWhitelist from "~hooks/useWhitelist"

import style from "./style.module.scss"

const WhiteList = () => {
  const { whitelist, removeWhitelist } = useWhitelist()

  const onRemoveHandle = useCallback(
    async (requestKey: string) => {
      await removeWhitelist(requestKey)
    },
    [removeWhitelist]
  )

  if (!whitelist || whitelist.length < 1) {
    return (
      <h2 className={style.whitelist_empty}>
        There is no requests in whitelist
      </h2>
    )
  }

  return (
    <ul className={style.whitelist}>
      {whitelist.map((value) => (
        <WhitelistItem
          key={value.key}
          requestKey={value.key}
          handleRemove={onRemoveHandle}
          {...value}
        />
      ))}
    </ul>
  )
}

export default WhiteList
