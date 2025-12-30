'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Lock } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialize Stripe (replace with your publishable key)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key_here');

function StripePaymentForm({ amount, onSuccess, onCancel }) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Create payment intent on your server
            const response = await fetch('/api/create-payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: parseFloat(amount) * 100 }), // Convert to cents
            });

            const { clientSecret } = await response.json();

            // Confirm the payment
            const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                },
            });

            if (stripeError) {
                setError(stripeError.message);
                setLoading(false);
            } else if (paymentIntent.status === 'succeeded') {
                onSuccess(paymentIntent);
            }
        } catch (err) {
            setError('Payment failed. Please try again.');
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Card Details</label>
                    <div className="p-4 border-2 border-border rounded-xl bg-background/50">
                        <CardElement
                            options={{
                                style: {
                                    base: {
                                        fontSize: '16px',
                                        color: '#f8fafc',
                                        fontFamily: 'system-ui, -apple-system, sans-serif',
                                        '::placeholder': {
                                            color: '#9ca3af',
                                        },
                                    },
                                    invalid: {
                                        color: '#ef4444',
                                    },
                                },
                            }}
                        />
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-destructive/10 border border-destructive rounded-xl text-destructive text-sm">
                        {error}
                    </div>
                )}

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Lock className="w-4 h-4" />
                    <span>Secured by Stripe. Your payment information is encrypted.</span>
                </div>
            </div>

            <div className="flex gap-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 px-6 py-3 rounded-full border-2 border-border hover:bg-muted transition-colors font-semibold"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={!stripe || loading}
                    className="flex-1 bg-gradient-to-r from-primary to-orange-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            <CreditCard className="w-5 h-5" />
                            Pay ${amount}
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}

export default function DonationModal({ isOpen, onClose }) {
    const [amount, setAmount] = useState('');
    const [customAmount, setCustomAmount] = useState('');
    const [showStripeForm, setShowStripeForm] = useState(false);

    const suggestedAmounts = [10, 25, 50, 100, 250, 500];

    const handleContinue = () => {
        const donationAmount = amount === 'custom' ? customAmount : amount;

        if (!donationAmount || parseFloat(donationAmount) <= 0) {
            alert('Please select or enter a valid amount');
            return;
        }

        setShowStripeForm(true);
    };

    const handlePaymentSuccess = (paymentIntent) => {
        alert(`Thank you for your donation of $${(paymentIntent.amount / 100).toFixed(2)}!`);
        onClose();
        // Reset form
        setAmount('');
        setCustomAmount('');
        setShowStripeForm(false);
    };

    const handleBack = () => {
        setShowStripeForm(false);
    };

    const finalAmount = amount === 'custom' ? customAmount : amount;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-background rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto glass-card"
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-background/95 backdrop-blur-lg border-b border-border p-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-3xl font-heading font-bold text-gradient">Support HCSEM</h2>
                                <p className="text-muted-foreground mt-1">
                                    {showStripeForm ? 'Complete your donation' : 'Your donation helps build our community'}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6">
                            {!showStripeForm ? (
                                /* Amount Selection */
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-semibold">Select Amount</h3>
                                        <div className="grid grid-cols-3 gap-3">
                                            {suggestedAmounts.map((amt) => (
                                                <button
                                                    key={amt}
                                                    onClick={() => setAmount(amt.toString())}
                                                    className={`p-4 rounded-xl border-2 transition-all ${amount === amt.toString()
                                                        ? 'border-primary bg-primary/10 text-primary'
                                                        : 'border-border hover:border-primary/50'
                                                        }`}
                                                >
                                                    <div className="text-2xl font-bold">${amt}</div>
                                                </button>
                                            ))}
                                        </div>

                                        {/* Custom Amount */}
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Or enter custom amount</label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-xl">$</span>
                                                <input
                                                    type="number"
                                                    value={customAmount}
                                                    onChange={(e) => {
                                                        setCustomAmount(e.target.value);
                                                        setAmount('custom');
                                                    }}
                                                    placeholder="Enter amount"
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-border focus:border-primary focus:outline-none bg-background text-lg"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Continue Button */}
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleContinue}
                                        disabled={!amount}
                                        className="w-full bg-gradient-to-r from-primary to-orange-500 text-white py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        Continue to Payment
                                        {finalAmount && ` - $${finalAmount}`}
                                    </motion.button>

                                    {/* Security Note */}
                                    <p className="text-center text-sm text-muted-foreground">
                                        🔒 Powered by Stripe. Your payment is secure and encrypted.
                                    </p>
                                </div>
                            ) : (
                                /* Stripe Payment Form */
                                <Elements stripe={stripePromise}>
                                    <div className="space-y-6">
                                        <div className="p-4 bg-primary/10 rounded-xl">
                                            <div className="text-sm text-muted-foreground mb-1">Donation Amount</div>
                                            <div className="text-3xl font-bold text-primary">${finalAmount}</div>
                                        </div>

                                        <StripePaymentForm
                                            amount={finalAmount}
                                            onSuccess={handlePaymentSuccess}
                                            onCancel={handleBack}
                                        />
                                    </div>
                                </Elements>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
