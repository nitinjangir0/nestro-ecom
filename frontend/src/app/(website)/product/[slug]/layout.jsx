
export default function ProductDetailsLayout({ children }) {
    return (
        <main className="min-h-screen bg-[#faf8f6]">
            <div className="mx-auto w-full max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8">
                {children}
            </div>
        </main>
    );
}