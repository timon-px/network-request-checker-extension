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
  disabled?: boolean
}

interface ITabsProps {
  defaultTab?: string
  children: ReactNode
}

// Tab Component
const Tab: React.FC<ITabProps> = ({ children }) => children

// Tab divider
const Divider: React.FC = () => null

// Tabs Component
const Tabs: React.FC<ITabsProps> & {
  Tab: typeof Tab
  Divider: typeof Divider
} = ({ defaultTab = "tab0", children }) => {
  const tabButtonsRef = useRef<(HTMLElement | null)[]>([])
  const tabListRef = useRef<HTMLElement | null>(null)
  const [tabs, dividers] = useMemo(() => validateTabs(children), [children])

  const [activeTab, setActiveTab] = useState<string>(defaultTab)

  const ActiveTabContent = () => tabs.get(activeTab).content

  useEffect(() => {
    if (!activeTab) return

    const setTabPosition = () => {
      const currentTab = tabButtonsRef.current[activeTab] as HTMLElement
      const left = `${currentTab?.offsetLeft}px` ?? 0
      const width = `${currentTab?.clientWidth}px` ?? 0

      tabListRef.current.attributeStyleMap.set("--tabSelectedLeft", left)
      tabListRef.current.attributeStyleMap.set("--tabSelectedWidth", width)
    }

    setTabPosition()
  }, [activeTab])

  const activeTabStyle = (index: string) =>
    clsx(style.tab_button, {
      [style.active]: activeTab === index
    })

  return (
    <div className={style.tabs_container}>
      <nav ref={tabListRef} className={style.tab_list} role="tablist">
        <span className={style.tab_list__selected}>
          <span className={style.tab_list__selected_bg}></span>
        </span>
        {Array.from(tabs.values()).map(({ id, label, disabled }) => (
          <React.Fragment key={id}>
            <button
              ref={(el) => (tabButtonsRef.current[id] = el)}
              type="button"
              role="tab"
              className={activeTabStyle(id)}
              onClick={() => setActiveTab(id)}
              disabled={disabled}>
              {label}
            </button>

            {dividers.has(id) && <span className={style.tab_list__divider} />}
          </React.Fragment>
        ))}
      </nav>

      <div className={style.tab_content} role="tabpanel">
        <ActiveTabContent />
      </div>
    </div>
  )
}

Tabs.Tab = Tab
Tabs.Divider = Divider
export default Tabs
