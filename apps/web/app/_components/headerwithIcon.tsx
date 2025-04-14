interface HeaderProps {
  text: string;
  leftIcon?: React.ReactNode; // Optional left icon
  rightIcon?: React.ReactNode; // Optional right icon
}

const HeaderwithIcon = ({ text, leftIcon, rightIcon }: HeaderProps) => {
  return (
    <div className="fixed flex w-full h-24 top-0 left-0 right-0 justify-center items-end p-4 bg-gradient-to-l from-lemon via-orange to-pumpkin z-10">
      <div className="w-[375px] flex items-center justify-between px-4">
        <div>{leftIcon}</div>
        <h3 className="text-white">{text}</h3>
        <div>{rightIcon}</div>
      </div>
    </div>
  );
};

export default HeaderwithIcon;
