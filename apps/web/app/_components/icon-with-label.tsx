import { LucideIcon } from 'lucide-react'

interface IconWithLabelProps {
  icon: LucideIcon
  label: string
  size?: number
  color?: string
}
const IconWithLabel = ({
  icon: Icon,
  label,
  size = 24,
  color = 'black',
}: IconWithLabelProps) => {
  return (
    <div className='inline-flex items-center gap-2'>
      <Icon size={size} color={color} />
      <span className='text-sm font-thin'>{label}</span>
    </div>
  )
}
export default IconWithLabel
