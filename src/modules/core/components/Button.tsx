import React from 'react'
import { Button as AntdButton } from 'antd' // Alias the antd Button as AntdButton

/**
 * Props for the Button component
 * @interface ButtonProps
 * @property {'primary' | 'default' | 'dashed' | 'text' | 'link'} [buttonType="primary"] - Type of button to render
 * @property {string} [buttonText="Button"] - Text to display inside the button
 * @property {React.ReactNode} [icon] - Optional icon to display in the button
 * @property {() => void} [onClick] - Click handler function
 * @property {boolean} [disabled=false] - Whether the button is disabled
 * @property {string} [className] - Additional CSS classes to apply
 * @property {React.CSSProperties} [style] - Inline styles to apply
 * @property {'small' | 'middle' | 'large'} [size] - Size of the button
 */
interface ButtonProps {
  buttonType?: 'primary' | 'default' | 'dashed' | 'text' | 'link'
  buttonText?: string
  icon?: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
  style?: React.CSSProperties
  size?: 'small' | 'middle' | 'large'
}

/**
 * Custom Button component wrapping Ant Design's Button with theme integration
 * @component
 * @param {ButtonProps} props - Component properties
 * @returns {React.JSX.Element} A flexible button component with theme support
 */
const Button: React.FC<ButtonProps> = ({
  buttonType = 'primary',
  buttonText = 'Button',
  icon,
  onClick,
  disabled = false,
  className = '',
  style,
  size = 'middle'
}) => {
  // Map our buttonType to Ant Design's type
  const antType = buttonType === 'default' ? undefined : buttonType

  // Combine custom classes with theme-aware classes based on button type

  return (
    <AntdButton
      type={antType}
      onClick={onClick}
      disabled={disabled}
      className={`shadow-none ${className}`}
      style={style}
      size={size}
      icon={icon}
    >
      {buttonText}
    </AntdButton>
  )
}

export default Button
