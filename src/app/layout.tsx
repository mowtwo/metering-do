import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, ZCOOL_KuaiLe } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { SkinProvider } from "@/components/skin-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const comicFont = ZCOOL_KuaiLe({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-comic",
});

export const metadata: Metadata = {
  title: "Metering-Do",
  description: "个人资产费用追踪",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0f172a",
};

const skinInitScript = `(function(){try{var s=localStorage.getItem('metering-do-skin');if(s==='p5'||s==='tech'||s==='minimal'){document.documentElement.setAttribute('data-skin',s)}else{document.documentElement.setAttribute('data-skin','minimal')}}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${comicFont.variable} antialiased`}
      >
        <script dangerouslySetInnerHTML={{ __html: skinInitScript }} />
        <SkinProvider>
          {children}
          <Toaster />
        </SkinProvider>
      </body>
    </html>
  );
}
