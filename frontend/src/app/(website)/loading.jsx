export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#F9F8F6]">
      <div className="flex flex-col items-center">

        {/* Logo */}
        <h1 className="text-5xl md:text-6xl font-light tracking-[12px] text-[#2A170F]">
          NESTRO<span className="text-[#B07A50]">.</span>
        </h1>

        {/* Spinner */}
        <div className="relative mt-10">
          <div className="h-16 w-16 rounded-full border-[3px] border-[#E7DED6]"></div>
          <div className="absolute inset-0 h-16 w-16 rounded-full border-[3px] border-transparent border-t-[#B07A50] animate-spin"></div>
        </div>

        {/* Loading text */}
        <div className="mt-8 flex items-center gap-1 text-sm tracking-[4px] text-gray-500">
          <span>LOADING</span>

          <span className="animate-bounce [animation-delay:0ms]">.</span>
          <span className="animate-bounce [animation-delay:200ms]">.</span>
          <span className="animate-bounce [animation-delay:400ms]">.</span>
        </div>

        {/* Tagline */}
        <p className="mt-4 text-xs uppercase tracking-[6px] text-gray-400">
          Luxury Furniture Collection
        </p>
      </div>
    </div>
  );
}