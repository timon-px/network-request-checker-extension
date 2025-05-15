import ActionButton from "@elements/ui/buttons/ActionButton"
import CheckIcon from "@elements/ui/Icons/CheckIcon"
import CopyCheckIcon from "@elements/ui/Icons/CopyCheckIcon"
import CopyIcon from "@elements/ui/Icons/CopyIcon"
import ErrorCircleIcon from "@elements/ui/Icons/ErrorCircleIcon"
import { memo, useCallback, useState, type FC } from "react"

import type { IGroupedRequest, IRequest } from "~/types/IRequest"
import { useCopyToClipboard } from "~hooks/useCopyToClipboard"

import style from "./style.module.scss"

const StatusIcon = {
  wait: <CopyIcon />,
  done: <CopyCheckIcon />,
  error: <ErrorCircleIcon />
}

type StatusType = keyof typeof StatusIcon

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
  const [copiedStatus, setCopiedStatus] = useState<StatusType>("wait")
  const [_, copy] = useCopyToClipboard()

  const handleClick = useCallback(() => {
    const request = requests.find(
      (req) => req.url && req.type && req.method && !req.inWhitelist
    )

    if (request) handleWhitelist(request)
  }, [requests, handleWhitelist])

  const handleClickCopy = useCallback(async () => {
    if (copiedStatus !== "wait") return

    try {
      await copy(url)
      setCopiedStatus("done")
    } catch (_) {
      setCopiedStatus("error")
    } finally {
      setTimeout(() => setCopiedStatus("wait"), 1500)
    }
  }, [url, copiedStatus, setCopiedStatus, copy])

  const CopyStatusIcon = useCallback(
    () => StatusIcon[copiedStatus],
    [copiedStatus]
  )

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
        <ActionButton onClick={handleClickCopy}>
          <CopyStatusIcon />
        </ActionButton>
      </div>
    </li>
  )
}

const areEqual = (prev: Props, next: Props) =>
  prev.method === next.method &&
  prev.type === next.type &&
  prev.url === next.url &&
  prev.count === next.count

const RequestItem = memo(RequestItemComponent, areEqual)

export default RequestItem
