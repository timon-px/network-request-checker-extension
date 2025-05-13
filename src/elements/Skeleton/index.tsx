import style from "./style.module.scss"

const Skeleton = () => {
  return (
    <li className={style.skeleton}>
      <div className={style.skeleton_content}>
        <div className={style.skeleton_info}>
          <span className={style.skeleton_box}></span>
        </div>

        <h2 className={style.skeleton_main}>
          <span className={style.skeleton_box}></span>
        </h2>
      </div>
    </li>
  )
}

export default Skeleton
