import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import { Toaster } from "sonner";
import { getProfile } from "@/utils/serverapi";
import { redirect } from "next/navigation";

const geistSans = Geist({variable: "--font-geist-sans", subsets: ["latin"],});
const geistMono = Geist_Mono({variable: "--font-geist-mono",subsets: ["latin"],});

export const metadata = {title: "Nestro Admin Panel",description: "Nestro Admin Panel",};
export default async function RootLayout({ children }) {
  // ===============================
  // GET LOGGED-IN USER
  // ===============================
  const response = await getProfile()
  const user = response?.data;
  // ===============================
  // NOT LOGGED IN
  // ===============================
  if (!user) { redirect("/login"); }
  // ===============================
  // USER ROLE CHECK
  // ===============================
  if (user.role !== "admin" && user.role !== "superadmin") { redirect("/"); }
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body>
        <Toaster
          position="top-right"
          richColors />
        <div className="w-full bg-white flex">
          {/* Sidebar */}
          <Sidebar />
          {/* Main Section */}
          <div className="flex-1">
            <Header />
            <div className="p-4">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}