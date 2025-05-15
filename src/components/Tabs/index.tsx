import { clsx } from "clsx"
import React, {
  useLayoutEffect,
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

const Divider: React.FC = () => null
const Tab: React.FC<ITabProps> = ({ children }) => children

const Tabs: React.FC<ITabsProps> & {
  Tab: typeof Tab
  Divider: typeof Divider
} = ({ defaultTab = "tab0", children }) => {
  const [tabs, dividers] = useMemo(() => validateTabs(children), [children])

  const tabListRef = useRef<HTMLElement | null>(null)
  const tabButtonsRef = useRef<Record<string, HTMLElement | null>>({})

  const initTab = tabs.has(defaultTab) ? defaultTab : Array.from(tabs.keys())[0]
  const [activeTab, setActiveTab] = useState<string>(initTab)

  const ActiveTabContent = () => tabs.get(activeTab).content

  useLayoutEffect(() => {
    const el = tabButtonsRef.current[activeTab]
    if (!el || !tabListRef.current) return

    const left = `${el.offsetLeft}px`
    const width = `${el.clientWidth}px`

    tabListRef.current.style.setProperty("--tabSelectedLeft", left)
    tabListRef.current.style.setProperty("--tabSelectedWidth", width)
  }, [activeTab])

  const activeTabStyle = (id: string) =>
    clsx(style.tab_button, {
      [style.active]: activeTab === id
    })

  return (
    <div className={style.tabs_container}>
      <nav ref={tabListRef} className={style.tab_list} role="tablist">
        <span className={style.tab_list__selected}>
          <span className={style.tab_list__selected_bg}></span>
        </span>
        {Array.from(tabs.entries()).map(([id, { label, disabled }]) => (
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
