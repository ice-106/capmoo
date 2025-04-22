interface HeaderProps {
  text: string
}

const Header = ({ text }: HeaderProps) => {
  return (
    <div className='from-lemon via-orange to-pumpkin fixed left-0 right-0 top-0 z-10 flex h-24 w-full items-end justify-center bg-gradient-to-l p-4'>
      <h3 className='text-white'>{text}</h3>
    </div>
  )
}

export default Header
