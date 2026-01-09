import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

import { LanguageProvider } from "@/context/LanguageContext";

export default function SiteLayout({ children }) {
    return (
        <LanguageProvider>
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow pt-16">
                    {children}
                </main>
                <Footer />
            </div>
        </LanguageProvider>
    );
}
