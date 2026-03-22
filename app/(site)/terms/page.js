'use client';

import { motion } from 'framer-motion';

export default function TermsOfService() {
    return (
        <div className="min-h-screen pt-32 pb-24 relative">
            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">Terms of Service</h1>
                    <p className="text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="prose prose-invert prose-lg max-w-none prose-headings:font-heading prose-headings:text-white prose-a:text-indigo-400 hover:prose-a:text-indigo-300"
                >
                    <div className="glass-card p-8 md:p-12 rounded-3xl">
                        <h2>1. Acceptance of Terms</h2>
                        <p>
                            By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                        </p>

                        <h2>2. Provision of Services</h2>
                        <p>
                            HCSEM is constantly innovating in order to provide the best possible experience for its users. You acknowledge and agree that the form and nature of the services which HCSEM provides may change from time to time without prior notice to you.
                        </p>
                        
                        <h2>3. Your Use of the Services</h2>
                        <p>
                            In order to access certain services, you may be required to provide information about yourself (such as identification or contact details) as part of the registration process for the Service, or as part of your continued use of the Services. You agree that any registration information you give to HCSEM will always be accurate, correct and up to date.
                        </p>

                        <h2>4. User Content</h2>
                        <p>
                            Some of our Services allow you to upload, submit, store, send or receive content. You retain ownership of any intellectual property rights that you hold in that content. In short, what belongs to you stays yours.
                        </p>

                        <h2>5. Termination</h2>
                        <p>
                            We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.
                        </p>

                        <h2>6. Contact Us</h2>
                        <p>
                            If you have any questions about these Terms, please contact us at info@hcsem.org.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
