import type { PlasmoMessaging } from "@plasmohq/messaging"

import { requestManager } from "~background"
import type { IRequest, IRequestPortRequest } from "~types/IRequest"

const handler: PlasmoMessaging.PortHandler<
  IRequestPortRequest,
  IRequest[]
> = async (request, response) => {
  if (request.body.type === "initSend") {
    await requestManager.initPortSend()
  } else response.send(request.body.requests)
}

export default handler
