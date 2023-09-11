import React, { CSSProperties, useState } from "react"
import "./Tooltip.css"

type TooltipProps = {
  text: string
  children: React.ReactNode
  style?: CSSProperties
}

const Tooltip = ({ text, children, style }: TooltipProps) => {
  const [showTooltip, setShowToolip] = useState(false)

  const handleMouseEnter = () => setShowToolip(true)
  const handleMouseLeave = () => setShowToolip(false)

  return (
    <div
      className="tooltip-container"
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      {children}
      {showTooltip && <div className="tooltip">{text}</div>}
    </div>
  )
}

export default Tooltip
