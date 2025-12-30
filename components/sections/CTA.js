'use client'
import { motion } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { Heart, Users, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function CTA() {
    return (
        <section className="py-20 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] animate-pulse"></div>

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto text-center space-y-8"
                >
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-tight">
                        Ready to Make a <span className="text-gradient">Difference?</span>
                    </h2>

                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Join our community or support our mission. Every contribution helps us build a stronger, more connected Ethiopian community in Minnesota.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                        <Link href="/contact">
                            <Button size="lg" variant="glow" className="text-lg px-8 group">
                                <Heart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                                Become a Member
                            </Button>
                        </Link>

                        <Link href="/contact?donate=true">
                            <Button size="lg" variant="outline" className="text-lg px-8 group">
                                <Users className="w-5 h-5 mr-2" />
                                Support Our Cause
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-16 border-t border-white/10">
                        <div>
                            <h3 className="text-4xl font-bold text-primary mb-2">$50K+</h3>
                            <p className="text-muted-foreground">Raised This Year</p>
                        </div>
                        <div>
                            <h3 className="text-4xl font-bold text-primary mb-2">150+</h3>
                            <p className="text-muted-foreground">Volunteers</p>
                        </div>
                        <div>
                            <h3 className="text-4xl font-bold text-primary mb-2">25+</h3>
                            <p className="text-muted-foreground">Programs</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
