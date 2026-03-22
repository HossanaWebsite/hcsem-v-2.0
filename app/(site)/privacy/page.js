'use client';

import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen pt-32 pb-24 relative">
            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">Privacy Policy</h1>
                    <p className="text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="prose prose-invert prose-lg max-w-none prose-headings:font-heading prose-headings:text-white prose-a:text-indigo-400 hover:prose-a:text-indigo-300"
                >
                    <div className="glass-card p-8 md:p-12 rounded-3xl">
                        <h2>1. Information We Collect</h2>
                        <p>
                            We collect information that you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, and other information you choose to provide.
                        </p>

                        <h2>2. How We Use Information</h2>
                        <p>
                            We may use the information we collect about you for various purposes, including to:
                        </p>
                        <ul>
                            <li>Provide, maintain, and improve our services, including, for example, to facilitate payments, send receipts, provide products and services you request (and send related information), develop new features, provide customer support to Users, develop safety features, authenticate users, and send product updates and administrative messages.</li>
                            <li>Perform internal operations, including, for example, to prevent fraud and abuse of our services; to troubleshoot software bugs and operational problems; to conduct data analysis, testing, and research; and to monitor and analyze usage and activity trends.</li>
                        </ul>

                        <h2>3. Sharing of Information</h2>
                        <p>
                            We may share the information we collect about you as described in this Statement or as described at the time of collection or sharing, including as follows:
                        </p>
                        <ul>
                            <li>With third parties to provide you a service you requested through a partnership or promotional offering made by a third party or us.</li>
                            <li>With the general public if you submit content in a public forum, such as blog comments, social media posts, or other features of our services that are viewable by the general public.</li>
                        </ul>

                        <h2>4. Security</h2>
                        <p>
                            We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.
                        </p>

                        <h2>5. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Statement, please contact us at info@hcsem.org.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
