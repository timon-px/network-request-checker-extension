import Tabs, { type ITabProps } from "@components/Tabs"
import React, { type ReactElement } from "react"

import type { ITab } from "~types/ITabs"

export function validateTabs(children: React.ReactNode) {
  const filteredTabs = React.Children.toArray(children).filter(
    (child): child is ReactElement<ITabProps> =>
      React.isValidElement(child) && child.type === Tabs.Tab
  )

  const map = new Map<string, ITab>()
  filteredTabs.forEach((tab, i) => {
    map.set("tab" + i, {
      label: tab.props.label,
      content: tab.props.children
    })
  })

  return map
}
