import React from "react"

export interface ITab {
  id: string
  label: string
  content: React.ReactNode
  disabled?: boolean
}
