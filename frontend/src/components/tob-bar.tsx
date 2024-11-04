import Image from "next/image";

export default function TopBar() {
  return (
    <header className="bg-white shadow-md border-b-4 sticky top-0 z-10">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Image
              className="h-12 w-12 mr-2"
              src={`/logo.jpeg`}
              alt="Logo"
              width={50}
              height={50}
            />
            <span className="font-bold text-xl text-blue-500">Neophilic</span>
          </div>
          <div className="flex items-center">
            <div className="bg-blue-500 rounded-full h-8 w-8 flex items-center justify-center text-white font-bold">
              A
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
