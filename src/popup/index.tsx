import "@styles/fonts.scss"
import "@styles/main.scss"

import Header from "@components/Header"
import RequestList from "@components/RequestList"
import Tabs from "@components/Tabs"
import WhiteList from "@components/WhiteList"

function IndexPopup() {
  return (
    <>
      <Header />
      <main>
        <Tabs>
          <Tabs.Tab label="Requsts">
            <RequestList />
          </Tabs.Tab>
          <Tabs.Tab label="Whitelist">
            <WhiteList />
          </Tabs.Tab>
        </Tabs>
      </main>
    </>
  )
}

export default IndexPopup
