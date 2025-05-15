import Tabs, { type ITabProps } from "@components/Tabs"
import React, { type ReactElement, type ReactNode } from "react"

import type { ITab } from "~types/ITabs"

// Type guard for valid tab elements
const isTabElement = (child: ReactNode): child is ReactElement<ITabProps> => {
  return (
    React.isValidElement(child) &&
    (child.type === Tabs.Tab || child.type === Tabs.Divider)
  )
}

/**
 * Validates and processes tab children into a Map of tabs and a Set of tab IDs
 * followed by dividers. Ensures unique IDs and valid tab components.
 * @param children - React children containing Tabs.Tab and Tabs.Divider components
 * @returns A tuple [Map<string, ITab>, Set<string>] with tab data and divider positions
 * @throws Error if invalid children or duplicate labels are detected
 */
export function validateTabs(
  children: ReactNode
): [Map<string, ITab>, Set<string>] {
  const filteredTabs = filterTabs(children)

  const mapTabs = new Map<string, ITab>()
  const setDividerAfter = new Set<string>()
  let currentTabIndex = 0

  for (const tab of filteredTabs) {
    if (tab.type === Tabs.Divider) {
      if (currentTabIndex === 0) continue
      setDividerAfter.add(buildTabId(currentTabIndex - 1))
    } else if (tab.type === Tabs.Tab) {
      const { label, children: content, disabled } = tab.props

      // Validate required props
      if (!label) {
        throw new Error(`Tab at index ${currentTabIndex} is missing a label`)
      }

      const tabId = buildTabId(currentTabIndex++)
      mapTabs.set(tabId, {
        id: tabId,
        label,
        content,
        disabled: disabled ?? false
      })
    }
  }

  return [mapTabs, setDividerAfter]
}

/**
 * Filters React children to include only valid tab or divider components.
 * @param children - React children to filter
 * @returns Array of valid tab or divider elements
 */
function filterTabs(children: ReactNode): ReactElement<ITabProps>[] {
  return React.Children.toArray(children).filter(isTabElement)
}

/**
 * Generates a unique tab ID based on index.
 * @param index - Tab index
 * @returns Unique tab ID (e.g., "tab0")
 */
function buildTabId(index: number): string {
  const TAB_ID_PREFIX = "tab"
  return `${TAB_ID_PREFIX}${index}`
}
