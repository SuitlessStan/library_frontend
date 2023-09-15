import React, { CSSProperties, useState } from "react"
import "./Tooltip.css"

type TooltipProps = {
  text: string
  children: React.ReactNode
  style?: CSSProperties
  className?: string
}

const Tooltip = ({ text, children, style, className }: TooltipProps) => {
  const [showTooltip, setShowToolip] = useState(false)

  const handleMouseEnter = () => setShowToolip(true)
  const handleMouseLeave = () => setShowToolip(false)

  return (
    <div
      className={`tooltip-container ${className}`}
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      {children}
      {showTooltip && <div className="tooltip">{text}</div>}
    </div>
  )
}

export default Tooltip
