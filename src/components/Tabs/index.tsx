import { clsx } from "clsx"
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from "react"

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
  const tabButtonsRef = useRef<(HTMLElement | null)[]>([])
  const tabListRef = useRef<HTMLElement | null>(null)
  const tabsMap = useMemo(() => validateTabs(children), [children])

  const [activeTab, setActiveTab] = useState<string>(defaultTab)

  const ActiveTabContent = () => tabsMap.get(activeTab).content

  useEffect(() => {
    if (!activeTab) return

    const setTabPosition = () => {
      const currentTab = tabButtonsRef.current[activeTab] as HTMLElement
      const tabUnderlineLeft = currentTab?.offsetLeft ?? 0
      const tabUnderlineWidth = currentTab?.clientWidth ?? 0

      tabListRef.current.attributeStyleMap.set(
        "--tabUnderlineLeft",
        tabUnderlineLeft + "px"
      )
      tabListRef.current.attributeStyleMap.set(
        "--tabUnderlineWidth",
        tabUnderlineWidth + "px"
      )
    }

    setTabPosition()
  }, [activeTab])

  return (
    <div className={style.tabs_container}>
      <nav ref={tabListRef} className={style.tab_list} role="tablist">
        {Array.from(tabsMap.entries()).map(([id, { label }]) => (
          <button
            key={id}
            ref={(el) => (tabButtonsRef.current[id] = el)}
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
