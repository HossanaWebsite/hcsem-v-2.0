'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema } from '@/lib/validationSchemas';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Heart, ChevronRight, ChevronLeft, CheckCircle, User, Home, MessageSquare } from 'lucide-react';
import DonationModal from '@/components/DonationModal';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { useLanguage } from '@/context/LanguageContext';

const STEPS = [
    { id: 1, label: 'Request Type', icon: Heart },
    { id: 2, label: 'Your Details', icon: User },
    { id: 3, label: 'Contact Info', icon: Phone },
    { id: 4, label: 'Review', icon: CheckCircle },
];

function StepIndicator({ currentStep }) {
    return (
        <div className="flex items-center justify-center gap-2 mb-10">
            {STEPS.map((step, i) => {
                const Icon = step.icon;
                const done = currentStep > step.id;
                const active = currentStep === step.id;
                return (
                    <div key={step.id} className="flex items-center gap-2">
                        <div className={`flex flex-col items-center gap-1`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                                done ? 'bg-indigo-600 border-indigo-600 text-white' :
                                active ? 'bg-white dark:bg-slate-900 border-indigo-500 text-indigo-500' :
                                'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-400'
                            }`}>
                                {done ? <CheckCircle size={18} /> : <Icon size={16} />}
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-wide hidden sm:block ${active ? 'text-indigo-500' : 'text-slate-400'}`}>
                                {step.label}
                            </span>
                        </div>
                        {i < STEPS.length - 1 && (
                            <div className={`w-8 sm:w-16 h-[2px] mb-5 rounded-full transition-colors duration-300 ${done ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-white/10'}`} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

function InputField({ label, error, children }) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</label>
            {children}
            {error && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><span>⚠</span> {error}</p>}
        </div>
    );
}

function ContactContent() {
    const searchParams = useSearchParams();
    const [step, setStep] = useState(1);
    const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
    const [contactReasons, setContactReasons] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const { getLocalized, language } = useLanguage();

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings');
                if (res.ok) {
                    const data = await res.json();
                    if (data.contactReasons) setContactReasons(data.contactReasons);
                }
            } catch (error) { console.error('Error fetching settings:', error); }
        };
        fetchSettings();
    }, []);

    useEffect(() => {
        if (searchParams.get('donate') === 'true') setIsDonationModalOpen(true);
    }, [searchParams]);

    const {
        register, handleSubmit, watch, formState: { errors }, reset, setValue, trigger,
    } = useForm({ resolver: zodResolver(contactSchema) });

    const watchedReason = watch('selectedReason');
    const watchedAll = watch();

    const nextStep = async () => {
        let fields = [];
        if (step === 1) fields = ['selectedReason'];
        if (step === 2) fields = ['first_name', 'last_name', 'Address', 'city', 'state'];
        if (step === 3) fields = ['email'];
        const valid = await trigger(fields);
        if (!valid) {
            // Show toast for each invalid field
            const fieldLabels = {
                selectedReason: 'Please select a reason for contacting us',
                first_name: 'First name is required',
                last_name: 'Last name is required',
                Address: 'Street address is required',
                city: 'City is required',
                state: 'State is required',
                email: 'A valid email address is required',
            };
            fields.forEach(f => {
                if (errors[f]) toast.warn(fieldLabels[f] || `${f} is required`, { autoClose: 10000 });
            });
            return;
        }
        setStep(s => Math.min(s + 1, 4));
    };

    const onSubmit = async (data) => {
        setSubmitting(true);
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error('Network error');
            toast.success('✅ Your request has been submitted! Check your email for a confirmation.', { autoClose: 10000 });
            reset();
            setStep(1);
        } catch {
            toast.error('❌ Failed to submit. Please try again.', { autoClose: 10000 });
        } finally {
            setSubmitting(false);
        }
    };

    const slideVariants = {
        enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
    };

    const inputClass = "w-full bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all text-sm";

    return (
        <div className="min-h-screen py-20 px-6">
            <DonationModal isOpen={isDonationModalOpen} onClose={() => setIsDonationModalOpen(false)} />
            <ToastContainer />

            <div className="max-w-5xl mx-auto space-y-16">
                {/* Hero */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
                    <h1 className="text-5xl md:text-6xl font-heading font-bold">Get In Touch</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Request support or share a life event with our community
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                    {/* Contact Info Sidebar */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 space-y-6">
                        <div className="glass-card p-8 space-y-6">
                            <h2 className="text-2xl font-heading font-bold">Contact Info</h2>
                            {[
                                { icon: Mail, label: 'Email', value: 'info@ahcsemn.org' },
                                { icon: Phone, label: 'Phone', value: '+1 (612) 555-0100' },
                                { icon: MapPin, label: 'Location', value: 'Minneapolis, Minnesota' },
                            ].map(({ icon: Icon, label, value }) => (
                                <div key={label} className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <Icon className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">{label}</p>
                                        <p className="text-muted-foreground text-sm">{value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="glass-card p-8 space-y-3">
                            <h2 className="text-xl font-heading font-bold">Office Hours</h2>
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <p><span className="font-semibold text-foreground">Mon – Fri:</span> 9:00 AM – 5:00 PM</p>
                                <p><span className="font-semibold text-foreground">Saturday:</span> 10:00 AM – 2:00 PM</p>
                                <p><span className="font-semibold text-foreground">Sunday:</span> Closed</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Multi-step Form */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-3 glass-card p-8">
                        <StepIndicator currentStep={step} />

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <AnimatePresence mode="wait" custom={step}>
                                {/* Step 1 — Reason */}
                                {step === 1 && (
                                    <motion.div key="step1" custom={1} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }} className="space-y-6">
                                        <div className="mb-2">
                                            <h3 className="text-xl font-bold text-foreground">What brings you here?</h3>
                                            <p className="text-sm text-muted-foreground mt-1">Choose the reason for reaching out</p>
                                        </div>
                                        <InputField label="Reason" error={errors.selectedReason?.message}>
                                            <select {...register('selectedReason')} className={inputClass}>
                                                <option value="">{language === 'am' ? 'ምክንያት ይምረጡ' : 'Choose Reason'}</option>
                                                {contactReasons.length > 0 ? (
                                                    contactReasons.map((r, i) => <option key={i} value={r.value}>{getLocalized(r.label)}</option>)
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
                                        </InputField>
                                        {watchedReason === 'Other' && (
                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                                                <InputField label="Specify your reason" error={errors.customReason?.message}>
                                                    <input {...register('customReason')} placeholder="Please specify" className={inputClass} />
                                                </InputField>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                )}

                                {/* Step 2 — Personal Details */}
                                {step === 2 && (
                                    <motion.div key="step2" custom={1} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }} className="space-y-5">
                                        <div className="mb-2">
                                            <h3 className="text-xl font-bold text-foreground">About you</h3>
                                            <p className="text-sm text-muted-foreground mt-1">Your name and address</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <InputField label="First name" error={errors.first_name?.message}>
                                                <input {...register('first_name')} placeholder="First name" className={inputClass} />
                                            </InputField>
                                            <InputField label="Last name" error={errors.last_name?.message}>
                                                <input {...register('last_name')} placeholder="Last name" className={inputClass} />
                                            </InputField>
                                        </div>
                                        <InputField label="Address">
                                            <input {...register('Address')} placeholder="Street address" className={inputClass} />
                                        </InputField>
                                        <InputField label="Apartment / Unit (optional)">
                                            <input {...register('company_name')} placeholder="Apt, unit, etc." className={inputClass} />
                                        </InputField>
                                        <div className="grid grid-cols-2 gap-4">
                                            <InputField label="City" error={errors.city?.message}>
                                                <input {...register('city')} placeholder="City" className={inputClass} />
                                            </InputField>
                                            <InputField label="State" error={errors.state?.message}>
                                                <input {...register('state')} placeholder="State" className={inputClass} />
                                            </InputField>
                                        </div>
                                        <InputField label="Zip code" error={errors.zip?.message}>
                                            <input {...register('zip')} placeholder="Zip code" pattern="[0-9]*" className={inputClass} />
                                        </InputField>
                                    </motion.div>
                                )}

                                {/* Step 3 — Contact Info */}
                                {step === 3 && (
                                    <motion.div key="step3" custom={1} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }} className="space-y-5">
                                        <div className="mb-2">
                                            <h3 className="text-xl font-bold text-foreground">How can we reach you?</h3>
                                            <p className="text-sm text-muted-foreground mt-1">Email and phone so we can follow up</p>
                                        </div>
                                        <InputField label="Email address" error={errors.email?.message}>
                                            <input type="email" {...register('email')} placeholder="your@email.com" className={inputClass} />
                                        </InputField>
                                        <InputField label="Phone">
                                            <PhoneInput
                                                placeholder="Enter phone number"
                                                defaultCountry="US"
                                                value={watchedAll.phone}
                                                onChange={v => setValue('phone', v)}
                                                className="phone-input-container w-full bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-indigo-500/30 transition-all flex gap-2"
                                            />
                                            {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
                                        </InputField>
                                        <InputField label="Additional notes (optional)">
                                            <textarea {...register('form_order_notes')} placeholder="Anything else we should know…" rows={4} className={`${inputClass} resize-none`} />
                                        </InputField>
                                    </motion.div>
                                )}

                                {/* Step 4 — Review */}
                                {step === 4 && (
                                    <motion.div key="step4" custom={1} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }} className="space-y-6">
                                        <div className="mb-2">
                                            <h3 className="text-xl font-bold text-foreground">Review your request</h3>
                                            <p className="text-sm text-muted-foreground mt-1">Everything look correct?</p>
                                        </div>
                                        <div className="space-y-3">
                                            {[
                                                { label: 'Reason', value: watchedAll.selectedReason === 'Other' ? watchedAll.customReason : watchedAll.selectedReason },
                                                { label: 'Name', value: `${watchedAll.first_name || ''} ${watchedAll.last_name || ''}`.trim() },
                                                { label: 'Address', value: [watchedAll.Address, watchedAll.city, watchedAll.state, watchedAll.zip].filter(Boolean).join(', ') },
                                                { label: 'Email', value: watchedAll.email },
                                                { label: 'Phone', value: watchedAll.phone },
                                                { label: 'Notes', value: watchedAll.form_order_notes },
                                            ].filter(f => f.value).map(({ label, value }) => (
                                                <div key={label} className="flex justify-between gap-4 py-3 border-b border-slate-100 dark:border-white/5 last:border-0">
                                                    <span className="text-sm font-semibold text-slate-500">{label}</span>
                                                    <span className="text-sm text-foreground text-right max-w-[60%] break-words">{value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Navigation Buttons */}
                            <div className="flex justify-between mt-8 pt-6 border-t border-slate-100 dark:border-white/5">
                                <button
                                    type="button"
                                    onClick={() => setStep(s => Math.max(s - 1, 1))}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-all font-medium text-sm ${step === 1 ? 'invisible' : ''}`}
                                >
                                    <ChevronLeft size={16} /> Back
                                </button>

                                {step < 4 ? (
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-lg shadow-indigo-500/20 transition-all"
                                    >
                                        Continue <ChevronRight size={16} />
                                    </button>
                                ) : (
                                    <motion.button
                                        type="submit"
                                        disabled={submitting}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-medium text-sm shadow-lg shadow-indigo-500/20 transition-all"
                                    >
                                        <Send size={15} />
                                        {submitting ? 'Submitting…' : 'Submit Request'}
                                    </motion.button>
                                )}
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export default function ContactPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ContactContent />
        </Suspense>
    );
}
