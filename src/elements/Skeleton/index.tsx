import type { FC } from "react"

import style from "./style.module.scss"

interface Props {
  amount?: number
}

const Skeleton: FC<Props> = ({ amount = 1 }) => {
  return (
    <>
      {Array.from({ length: amount }).map((_, index) => (
        <li key={index} className={style.skeleton}>
          <div className={style.skeleton_content}>
            <div className={style.skeleton_info}>
              <span className={style.skeleton_box}></span>
            </div>

            <h2 className={style.skeleton_main}>
              <span className={style.skeleton_box}></span>
            </h2>
          </div>
        </li>
      ))}
    </>
  )
}

export default Skeleton
