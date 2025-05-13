import ActionButton from "@elements/ui/buttons/ActionButton"
import MinusCircleIcon from "@elements/ui/Icons/MinusCircleIcon"
import { memo, useCallback, type FC } from "react"

import type { IWhiteRequest } from "~/types/IRequest"

import style from "./style.module.scss"

interface Props extends Omit<IWhiteRequest, "key"> {
  requestKey: string
  handleRemove: (requestKey: string) => void
}

const WhitelistItemComponent: FC<Props> = ({
  method,
  type,
  url,
  requestKey,
  handleRemove
}) => {
  const handleClick = useCallback(() => {
    if (requestKey) handleRemove(requestKey)
  }, [requestKey, handleRemove])

  return (
    <li className={style.whitelist_item}>
      <div className={style.whitelist_item_content}>
        <div className={style.whitelist_item_info__wrapper}>
          <div className={style.whitelist_item_info}>
            <h1 className={style.whitelist_item__title}>
              {"Method: "}
              <span className={style.whitelist_item__about}>{method}</span>
            </h1>
          </div>
          <div className={style.whitelist_item_info}>
            <h1 className={style.whitelist_item__title}>
              {"Type: "}
              <span className={style.whitelist_item__about}>{type}</span>
            </h1>
          </div>
        </div>

        <h2 className={style.whitelist_item_main}>{url}</h2>
      </div>

      <div className={style.whitelist_item_action}>
        <ActionButton onClick={handleClick}>
          <MinusCircleIcon />
        </ActionButton>
      </div>
    </li>
  )
}

const WhitelistItem = memo(
  WhitelistItemComponent,
  (prevProps, nextProps) =>
    prevProps.requestKey === nextProps.requestKey &&
    prevProps.method === nextProps.method &&
    prevProps.type === nextProps.type &&
    prevProps.url === nextProps.url
)

export default WhitelistItem
