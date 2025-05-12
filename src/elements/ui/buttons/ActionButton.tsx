import { forwardRef, memo, type ButtonHTMLAttributes } from "react"

import style from "./style.module.scss"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const ActionButtonComponent = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => {
    return (
      <button ref={ref} className={style.button} {...props}>
        {children}
      </button>
    )
  }
)

const ActionButton = memo(ActionButtonComponent)

export default ActionButton
