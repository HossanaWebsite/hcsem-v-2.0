import { Poppins, Space_Grotesk } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import SitePreloader from "@/components/SitePreloader"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-poppins" })
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" })

export const metadata = {
  metadataBase: new URL('https://ahcsemn.org'),
  title: "HCSEM - Association of Hossaaena City",
  description: "Connecting Ethiopians in Minnesota. Building a stronger, united community.",
  openGraph: {
    title: "HCSEM - Association of Hossaaena City",
    description: "Connecting Ethiopians in Minnesota. Building a stronger, united community.",
    url: 'https://ahcsemn.org',
    siteName: 'HCSEM',
    images: [
      {
        url: '/images/logo.png', // Fallback global share image
        width: 1200,
        height: 630,
        alt: 'HCSEM Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "HCSEM - Association of Hossaaena City",
    description: "Connecting Ethiopians in Minnesota. Building a stronger, united community.",
    images: ['/images/logo.png'],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={cn(
        "min-h-screen bg-background font-sans antialiased",
        poppins.variable,
        spaceGrotesk.variable
      )}>
        <SitePreloader />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
