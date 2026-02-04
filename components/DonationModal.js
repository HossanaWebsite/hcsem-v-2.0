'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Lock } from 'lucide-react';

export default function DonationModal({ isOpen, onClose }) {
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const suggestedAmounts = [10, 25, 50, 100, 250, 500];
  const finalAmount = amount === 'custom' ? customAmount : amount;

  const handleCheckout = async () => {
    if (!finalAmount || parseFloat(finalAmount) <= 0) {
      alert('Please select or enter a valid amount');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/stripe-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(finalAmount) }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('Stripe checkout error:', data.error);
        alert('Something went wrong. Please try again.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error. Please try again.');
      setLoading(false);
    }
  };

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
                <p className="text-muted-foreground mt-1">Your donation helps build our community</p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
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

                {/* Stripe Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  disabled={!finalAmount || loading}
                  className="w-full bg-gradient-to-r from-primary to-orange-500 text-white py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Pay with Stripe
                      {finalAmount && ` - $${finalAmount}`}
                    </>
                  )}
                </motion.button>

                {/* Security Note */}
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Lock className="w-4 h-4" />
                  <span>Secured by Stripe. Your payment information is encrypted.</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
