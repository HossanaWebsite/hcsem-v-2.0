'use client'
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/Card"
import { Users, Target, Heart, Award } from "lucide-react"

export default function About() {
    const values = [
        {
            icon: Users,
            title: "Community First",
            description: "Building strong connections within our Ethiopian community in Minnesota."
        },
        {
            icon: Target,
            title: "Cultural Heritage",
            description: "Preserving and celebrating the rich traditions of Hossaaena City."
        },
        {
            icon: Heart,
            title: "Support & Care",
            description: "Providing assistance and resources to community members in need."
        },
        {
            icon: Award,
            title: "Excellence",
            description: "Striving for the highest standards in all our community initiatives."
        }
    ]

    return (
        <section className="py-20 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left - Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6"
                    >
                        <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                            <span className="text-primary font-semibold text-sm uppercase tracking-wider">About Us</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-tight">
                            Empowering Our <span className="text-gradient">Community</span>
                        </h2>

                        <p className="text-lg text-muted-foreground leading-relaxed">
                            The Association of Hossaaena City and Surroundings Ethiopians in Minnesota (HCSEM) is dedicated to fostering unity, preserving cultural heritage, and supporting the growth of our community members.
                        </p>

                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Since our founding, we've brought together families, organized cultural events, and provided essential support services to help our community thrive in their new home while maintaining strong ties to our roots.
                        </p>

                        <div className="grid grid-cols-2 gap-6 pt-6">
                            <div>
                                <h3 className="text-4xl font-bold text-primary">15+</h3>
                                <p className="text-muted-foreground">Years Serving</p>
                            </div>
                            <div>
                                <h3 className="text-4xl font-bold text-primary">1,200+</h3>
                                <p className="text-muted-foreground">Active Members</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right - Values Grid */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                    >
                        {values.map((value, index) => (
                            <motion.div
                                key={value.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Card className="h-full hover:border-primary/50 transition-all duration-300 group">
                                    <CardContent className="p-6 space-y-4">
                                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                            <value.icon className="w-6 h-6 text-primary" />
                                        </div>
                                        <h3 className="text-xl font-bold text-foreground">{value.title}</h3>
                                        <p className="text-muted-foreground">{value.description}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
