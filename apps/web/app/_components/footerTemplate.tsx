const FooterTemplate = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="fixed h-28 bottom-0 left-0 right-0 flex justify-center items-start
     bg-white p-4 shadow-[0_-2px_8px_-2px_rgba(0,0,0,0.2)] z-10">
      <div className="w-[375px]">
        {children}
      </div>
    </div>
  );
};

export default FooterTemplate;
