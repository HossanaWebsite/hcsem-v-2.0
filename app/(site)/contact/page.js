'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema } from '@/lib/validationSchemas';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Heart } from 'lucide-react';
import DonationModal from '@/components/DonationModal';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { useLanguage } from '@/context/LanguageContext';

function ContactContent() {
    const searchParams = useSearchParams();
    const [selectedReason, setSelectedReason] = useState('');
    const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
    const [contactReasons, setContactReasons] = useState([]);
    const { getLocalized, language } = useLanguage();

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings');
                if (res.ok) {
                    const data = await res.json();
                    if (data.contactReasons) {
                        setContactReasons(data.contactReasons);
                    }
                }
            } catch (error) {
                console.error('Error fetching settings:', error);
            }
        };
        fetchSettings();
    }, []);

    // Check if donate query parameter is present
    useEffect(() => {
        if (searchParams.get('donate') === 'true') {
            setIsDonationModalOpen(true);
        }
    }, [searchParams]);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
        setValue,
    } = useForm({
        resolver: zodResolver(contactSchema),
    });

    const watchSelectedReason = watch('selectedReason');

    const onSubmit = async (data) => {
        console.log('Submitting data:', data);
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log('Result', result);

            toast.success(
                `Your request has been submitted for: ${data.selectedReason === 'Other' ? data.customReason : data.selectedReason
                }`,
                {
                    position: 'top-right',
                    autoClose: 4000,
                }
            );

            reset();
            setSelectedReason('');
        } catch (error) {
            toast.error('Failed to submit the request. Please try again.', {
                position: 'top-right',
                autoClose: 4000,
            });
        }
    };

    return (
        <div className="min-h-screen py-20 px-6">
            <DonationModal isOpen={isDonationModalOpen} onClose={() => setIsDonationModalOpen(false)} />
            <ToastContainer />

            <div className="max-w-7xl mx-auto space-y-16">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-6"
                >
                    <h1 className="text-6xl md:text-7xl font-heading font-bold">
                        Get In Touch
                    </h1>
                    <p className="text-2xl text-muted-foreground max-w-3xl mx-auto">
                        Request support or share a life event with our community
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        <div className="glass-card p-10 space-y-8">
                            <h2 className="text-3xl font-heading font-bold">Contact Information</h2>

                            <div className="space-y-6">
                                <div className="flex items-start gap-6">
                                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-2">Email</h3>
                                        <p className="text-muted-foreground">info@hcsem.org</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6">
                                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <Phone className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-2">Phone</h3>
                                        <p className="text-muted-foreground">+1 (555) 123-4567</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6">
                                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-2">Location</h3>
                                        <p className="text-muted-foreground">Minneapolis, Minnesota</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-10 space-y-6">
                            <h2 className="text-3xl font-heading font-bold">Office Hours</h2>
                            <div className="space-y-3 text-muted-foreground text-lg">
                                <p>
                                    <span className="font-semibold text-foreground">Monday - Friday:</span> 9:00 AM - 5:00 PM
                                </p>
                                <p>
                                    <span className="font-semibold text-foreground">Saturday:</span> 10:00 AM - 2:00 PM
                                </p>
                                <p>
                                    <span className="font-semibold text-foreground">Sunday:</span> Closed
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card p-10"
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <Heart className="w-8 h-8 text-primary" />
                            <h2 className="text-3xl font-heading font-bold">
                                Request Support or Share a Life Event
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Reason Selector */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium">Choose the reason</label>
                                <select
                                    {...register('selectedReason')}
                                    onChange={(e) => setSelectedReason(e.target.value)}
                                    className="w-full bg-background/50 border border-border rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                >
                                    <option value="">{language === 'am' ? 'ምክንያት ይምረጡ' : 'Choose Reason'}</option>
                                    {contactReasons.length > 0 ? (
                                        contactReasons.map((reason, index) => (
                                            <option key={index} value={reason.value}>
                                                {getLocalized(reason.label)}
                                            </option>
                                        ))
                                    ) : (
                                        <>
                                            <option>Birthday</option>
                                            <option>Graduation</option>
                                            <option>New baby</option>
                                            <option>Wedding</option>
                                            <option>Funeral</option>
                                            <option>New Arrival (to the US)</option>
                                            <option>Other</option>
                                        </>
                                    )}

                                </select>
                                {errors.selectedReason && (
                                    <p className="text-destructive text-sm">{errors.selectedReason.message}</p>
                                )}
                            </div>

                            {/* Custom Reason */}
                            {watchSelectedReason === 'Other' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="space-y-3"
                                >
                                    <input
                                        type="text"
                                        placeholder="Please specify the reason"
                                        {...register('customReason')}
                                        className="w-full bg-background/50 border border-border rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                    />
                                    {errors.customReason && (
                                        <p className="text-destructive text-sm">{errors.customReason.message}</p>
                                    )}
                                </motion.div>
                            )}

                            {/* Name Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-sm font-medium">First name</label>
                                    <input
                                        type="text"
                                        placeholder="First name"
                                        {...register('first_name')}
                                        className="w-full bg-background/50 border border-border rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                    />
                                    {errors.first_name && (
                                        <p className="text-destructive text-sm">{errors.first_name.message}</p>
                                    )}
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm font-medium">Last name</label>
                                    <input
                                        type="text"
                                        placeholder="Last name"
                                        {...register('last_name')}
                                        className="w-full bg-background/50 border border-border rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                    />
                                    {errors.last_name && (
                                        <p className="text-destructive text-sm">{errors.last_name.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Address Fields */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium">Address</label>
                                <input
                                    type="text"
                                    placeholder="Address"
                                    {...register('Address')}
                                    className="w-full bg-background/50 border border-border rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium">Apartment, unit, etc. (optional)</label>
                                <input
                                    type="text"
                                    placeholder="Apartment, unit, etc."
                                    {...register('company_name')}
                                    className="w-full bg-background/50 border border-border rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium">Town / City</label>
                                <input
                                    type="text"
                                    placeholder="Town / City"
                                    {...register('city')}
                                    className="w-full bg-background/50 border border-border rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                />
                                {errors.city && <p className="text-destructive text-sm">{errors.city.message}</p>}
                            </div>

                            {/* State and Zip */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-sm font-medium">State</label>
                                    <input
                                        type="text"
                                        placeholder="State"
                                        {...register('state')}
                                        className="w-full bg-background/50 border border-border rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                    />
                                    {errors.state && (
                                        <p className="text-destructive text-sm">{errors.state.message}</p>
                                    )}
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm font-medium">Zip code</label>
                                    <input
                                        type="text"
                                        placeholder="Zip code"
                                        {...register('zip')}
                                        pattern="[0-9]*"
                                        className="w-full bg-background/50 border border-border rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                    />
                                    {errors.zip && <p className="text-destructive text-sm">{errors.zip.message}</p>}
                                </div>
                            </div>

                            {/* Email and Phone */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-sm font-medium">Email address</label>
                                    <input
                                        type="email"
                                        placeholder="Email address"
                                        {...register('email')}
                                        className="w-full bg-background/50 border border-border rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                    />
                                    {errors.email && (
                                        <p className="text-destructive text-sm">{errors.email.message}</p>
                                    )}
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm font-medium">Phone</label>
                                    <div className="phone-input-container">
                                        <PhoneInput
                                            placeholder="Enter phone number"
                                            defaultCountry="US"
                                            value={watch('phone')}
                                            onChange={(value) => setValue('phone', value)}
                                            className="phone-input-container w-full bg-background/50 border border-border rounded-lg p-4 focus-within:ring-2 focus-within:ring-primary/50 transition-all flex gap-2"
                                        />
                                    </div>
                                    {errors.phone && (
                                        <p className="text-destructive text-sm">{errors.phone.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium">Notes about the request</label>
                                <textarea
                                    placeholder="Notes about the request"
                                    {...register('form_order_notes')}
                                    className="w-full bg-background/50 border border-border rounded-lg p-4 h-32 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                                />
                            </div>

                            {/* Submit Button */}
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-3 text-lg shadow-lg"
                            >
                                <Send className="w-5 h-5" />
                                Submit Request
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            </div >
        </div >
    );
}

export default function ContactPage() {
    return (
        <Suspense fallback={<div>Loading ...</div>}>
            <ContactContent />
        </Suspense>
    );
}
