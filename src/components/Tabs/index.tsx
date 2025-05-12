import { clsx } from "clsx"
import React, { useMemo, useState, type ReactNode } from "react"

import { validateTabs } from "~utils/tabUtils"

import style from "./style.module.scss"

export interface ITabProps {
  label: string
  children: ReactNode
}

interface ITabsProps {
  defaultTab?: string
  children: ReactNode
}

// Tab Component
const Tab: React.FC<ITabProps> = ({ children }) => children

// Tabs Component
const Tabs: React.FC<ITabsProps> & { Tab: typeof Tab } = ({
  defaultTab = "tab0",
  children
}) => {
  const tabsMap = useMemo(() => validateTabs(children), [children])

  const [activeTab, setActiveTab] = useState<string>(defaultTab)

  const ActiveTabContent = () => tabsMap.get(activeTab).content

  return (
    <div className={style.tabs_container}>
      <nav className={style.tab_list} role="tablist">
        {Array.from(tabsMap.entries()).map(([id, { label }]) => (
          <button
            key={id}
            type="button"
            role="tab"
            className={clsx(style.tab_button, {
              [style.active]: activeTab === id
            })}
            onClick={() => setActiveTab(id)}>
            {label}
          </button>
        ))}
      </nav>

      <div className={style.tab_content} role="tabpanel">
        <ActiveTabContent />
      </div>
    </div>
  )
}

Tabs.Tab = Tab
export default Tabs
