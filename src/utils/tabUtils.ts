import Tabs, { type ITabProps } from "@components/Tabs"
import React, { type ReactElement, type ReactNode } from "react"

import type { ITab } from "~types/ITabs"

const TAB_ID_PREFIX = "tab"

// ✅ Type guard for Tabs.Tab or Tabs.Divider
const isTabElement = (child: ReactNode): child is ReactElement<ITabProps> => {
  return (
    React.isValidElement(child) &&
    (child.type === Tabs.Tab || child.type === Tabs.Divider)
  )
}

/**
 * Filters only valid Tabs.Tab or Tabs.Divider components
 */
function filterTabs(children: ReactNode): ReactElement<ITabProps>[] {
  return React.Children.toArray(children).filter(isTabElement)
}

/**
 * Builds a unique tab ID string
 */
function buildTabId(index: number, prefix = TAB_ID_PREFIX): string {
  return `${prefix}${index}`
}

/**
 * Validates tab children and returns structured tab data
 * @throws Error on invalid props
 */
export function validateTabs(
  children: ReactNode
): [Map<string, ITab>, Set<string>] {
  const filteredTabs = filterTabs(children)

  const mapTabs = new Map<string, ITab>()
  const setDividerAfter = new Set<string>()

  let currentTabIndex = 0
  let lastTabId: string | null = null

  for (const tab of filteredTabs) {
    if (tab.type === Tabs.Divider) {
      if (lastTabId) setDividerAfter.add(lastTabId)
      continue
    }

    if (tab.type === Tabs.Tab) {
      const { label, children: content, disabled } = tab.props

      if (!label || typeof label !== "string") {
        throw new Error(
          `Tab at index ${currentTabIndex} is missing a valid label.`
        )
      }

      const tabId = buildTabId(currentTabIndex++)
      mapTabs.set(tabId, {
        id: tabId,
        label,
        content,
        disabled: !!disabled
      })

      lastTabId = tabId
    }
  }

  return [mapTabs, setDividerAfter]
}
