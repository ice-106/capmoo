import Header from "./_components/header";
import Footer from "./_components/footer";

export default function Page() {
  return (
    <main>
      <div className={`bg-gray-100 flex justify-center`}>
        {/* Outer wrapper for full-screen background/header/footer */}
        <Header text="Header" />
        <Footer />
        <div className="min-h-screen w-full flex justify-center items-center">
          {/* Mobile fixed-width frame */}
          <div className="w-[375px] min-h-[812px] bg-white">Page</div>
        </div>
      </div>
    </main>
  );
}
