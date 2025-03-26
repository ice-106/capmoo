interface HeaderProps {
  text: string;
}

const Header = ({ text }: HeaderProps) => {
  return (
    <div className="fixed flex w-full h-24 justify-center items-end p-4 bg-gradient-to-l from-lemon via-orange to-pumpkin">
      <h3 className="text-white">{text}</h3>
    </div>
  );
};

export default Header;
