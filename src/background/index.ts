import { getPort } from "@plasmohq/messaging/background"

import { getWhitelist } from "~background/messages/whitelist"
import type { IRequest, IRequestsByTab, IWhiteRequest } from "~types/IRequest"
import { debounce } from "~utils/debounce"
import { getRequestKey } from "~utils/requestUtils"

class RequestManager {
  private currentTabId: number | null = null
  private requestListByTab: IRequestsByTab = {}
  private readonly portName = "requests"
  private readonly debounceWait = 100 // ms

  constructor() {
    this.setupListeners()
  }

  public async initPortSend() {
    if (this.currentTabId) {
      await this.sendToPort(this.requestListByTab[this.currentTabId])
    }
  }

  private async sendToPort(requests: IRequest[] = []): Promise<void> {
    try {
      const port = getPort(this.portName)

      const whitelist = await getWhitelist()
      const filteredRequests = this.filterRequests(requests, whitelist)

      port.postMessage(filteredRequests)
    } catch (_) {}
  }

  private filterRequests(
    requests: IRequest[],
    whitelist: Map<string, IWhiteRequest>
  ): IRequest[] {
    return requests.map(
      (request): IRequest => ({
        ...request,
        inWhitelist: whitelist.has(request.key)
      })
    )
  }

  private debouncedSendToPort = debounce(
    (requests: IRequest[]) => this.sendToPort(requests),
    this.debounceWait
  )

  private cleanupTabData(tabId: number): void {
    if (!this.requestListByTab[tabId]) return
    delete this.requestListByTab[tabId]

    if (this.currentTabId === tabId) {
      this.debouncedSendToPort([]) // Notify popup of cleared data
    }
  }

  private setupListeners(): void {
    // Handle port connections
    chrome.runtime.onConnect.addListener((port) => {
      if (port.name !== this.portName) return

      chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        if (!tab?.id) return
        this.currentTabId = tab.id
        this.sendToPort(this.requestListByTab[this.currentTabId] || []).finally(
          () =>
            console.log(`Handle port connection with '${this.currentTabId}'`)
        )
      })

      port.onDisconnect.addListener(() => {
        this.currentTabId = null
      })
    })

    // Capture cross-domain requests
    chrome.webRequest.onBeforeRequest.addListener(
      (details) => {
        if (details.tabId < 0) return

        const currentDomain = new URL(details.initiator || details.url).hostname
        const requestDomain = new URL(details.url).hostname

        if (requestDomain !== currentDomain) {
          this.requestListByTab[details.tabId] ??= []
          if (
            !this.requestListByTab[details.tabId].some(
              (req) => req.requestId === details.requestId
            )
          ) {
            this.requestListByTab[details.tabId].push({
              ...details,
              key: getRequestKey(details)
            })

            if (this.currentTabId === details.tabId) {
              this.debouncedSendToPort(this.requestListByTab[details.tabId])
            }
          }
        }
      },
      { urls: ["<all_urls>"] }
    )

    // Clean up on tab removal
    chrome.tabs.onRemoved.addListener((tabId) => {
      this.cleanupTabData(tabId)
    })

    // Clean up on tab update (refresh, navigation)
    chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
      if (changeInfo.status === "loading") {
        this.cleanupTabData(tabId)
      }
    })

    // Clean up on navigation commit (handles session restore, redirects, etc.)
    chrome.webNavigation.onCommitted.addListener((details) => {
      if (details.tabId >= 0 && details.frameId === 0) {
        this.cleanupTabData(details.tabId)
      }
    })

    // Handle tab replacement (e.g., chrome.tabs.create with openerTabId)
    chrome.tabs.onReplaced.addListener((_, removedTabId) => {
      this.cleanupTabData(removedTabId)
    })
  }
}

// Initialize the manager
const requestManager = new RequestManager()
export { requestManager }
