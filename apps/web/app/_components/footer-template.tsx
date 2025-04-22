const FooterTemplate = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='fixed bottom-0 left-0 right-0 z-10 flex h-28 items-start justify-center bg-white p-4 shadow-[0_-2px_8px_-2px_rgba(0,0,0,0.2)]'>
      <div className='w-[375px]'>{children}</div>
    </div>
  )
}

export default FooterTemplate
