import type { Metadata } from "next";
// import localFont from "next/font/local";
import "./globals.css";
import CustomSidebar from "@/components/custom-sidebar";

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

export const metadata: Metadata = {
  title: "Big Delícias Delivery",
  description: "O Melhor açai artesanal da região",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className="flex">
        <div>
          <CustomSidebar />
        </div>
        <div className="lg:ml-20 p-4 w-full">{children}</div>
      </body>
    </html>
  );
}
