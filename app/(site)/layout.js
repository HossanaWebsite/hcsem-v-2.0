import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { LanguageProvider } from "@/context/LanguageContext";
import BackToTop from "@/components/common/BackToTop";
import CookieBanner from "@/components/common/CookieBanner";
import PageTransition from "@/components/common/PageTransition";

export default function SiteLayout({ children }) {
    return (
        <LanguageProvider>
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow pt-16">
                    <PageTransition>
                        {children}
                    </PageTransition>
                </main>
                <Footer />
                <BackToTop />
                <CookieBanner />
            </div>
        </LanguageProvider>
    );
}
