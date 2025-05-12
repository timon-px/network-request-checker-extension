import ActionButton from "@elements/ui/buttons/ActionButton"
import CheckIcon from "@elements/ui/Icons/CheckIcon"
import { memo, useCallback, type FC } from "react"

import type { IGroupedRequest, IRequest } from "~/types/IRequest"

import style from "./style.module.scss"

interface Props extends IGroupedRequest {
  handleWhitelist: (request: IRequest) => void
}

const RequestItemComponent: FC<Props> = ({
  method,
  type,
  url,
  count,
  requests,
  handleWhitelist
}) => {
  const handleClick = useCallback(() => {
    const request = requests.find(
      (req) => req.url && req.type && req.method && !req.inWhitelist
    )

    if (request) handleWhitelist(request)
  }, [requests, handleWhitelist])

  return (
    <li className={style.request_item}>
      <div className={style.request_item_content}>
        <div className={style.request_item_info__wrapper}>
          <div className={style.request_item_info}>
            <h1 className={style.request_item__title}>
              {"Method: "}
              <span className={style.request_item__about}>{method}</span>
            </h1>
          </div>
          <div className={style.request_item_info}>
            <h1 className={style.request_item__title}>
              {"Type: "}
              <span className={style.request_item__about}>{type}</span>
            </h1>
          </div>

          {count > 1 && (
            <div className={style.request_item_amount}>
              <h5 className={style.request_item__about}>({count})</h5>
            </div>
          )}
        </div>

        <h2 className={style.request_item_main}>{url}</h2>
      </div>

      <div className={style.request_item_action}>
        <ActionButton onClick={handleClick}>
          <CheckIcon />
        </ActionButton>
      </div>
    </li>
  )
}

const RequestItem = memo(
  RequestItemComponent,
  (prevProps, nextProps) =>
    prevProps.method === nextProps.method &&
    prevProps.type === nextProps.type &&
    prevProps.url === nextProps.url &&
    prevProps.count === nextProps.count
)

export default RequestItem
