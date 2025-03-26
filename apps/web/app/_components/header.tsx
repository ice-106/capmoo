interface HeaderProps {
  text: string;
}

const Header = ({ text }: HeaderProps) => {
  return (
    <div className="fixed flex w-full h-24 top-0 left-0 right-0 justify-center items-end p-4 bg-gradient-to-l from-lemon via-orange to-pumpkin">
      <h3 className="text-white">{text}</h3>
    </div>
  );
};

export default Header;
