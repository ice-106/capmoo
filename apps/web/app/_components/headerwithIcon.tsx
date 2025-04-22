interface HeaderProps {
  text: string
  leftIcon?: React.ReactNode // Optional left icon
  rightIcon?: React.ReactNode // Optional right icon
}

const HeaderwithIcon = ({ text, leftIcon, rightIcon }: HeaderProps) => {
  return (
    <div className='from-lemon via-orange to-pumpkin fixed left-0 right-0 top-0 z-10 flex h-24 w-full items-end justify-center bg-gradient-to-l p-4'>
      <div className='flex w-[375px] items-center justify-between px-4'>
        <div>{leftIcon}</div>
        <h3 className='text-white'>{text}</h3>
        <div>{rightIcon}</div>
      </div>
    </div>
  )
}

export default HeaderwithIcon
