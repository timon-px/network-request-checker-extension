import type { PlasmoMessaging } from "@plasmohq/messaging"

import { requestManager } from "~background"
import type { IRequest, IRequestPortRequest } from "~types/IRequest"

const handler: PlasmoMessaging.PortHandler<
  IRequestPortRequest,
  IRequest[]
> = async (req, res) => {
  const { type, requests } = req.body

  switch (type) {
    case "initSend":
      await requestManager.initPortSend()
      break

    default:
      return res.send(requests)
  }
}

export default handler
