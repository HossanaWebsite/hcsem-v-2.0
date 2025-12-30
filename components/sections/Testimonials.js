'use client'
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/Card"
import { Quote } from "lucide-react"

export default function Testimonials() {
    const testimonials = [
        {
            name: "Abebe Tadesse",
            role: "Community Member",
            content: "HCSEM has been instrumental in helping my family settle in Minnesota. The support and sense of community we've found here is invaluable.",
            avatar: "AT"
        },
        {
            name: "Marta Bekele",
            role: "Volunteer Coordinator",
            content: "Being part of this organization has allowed me to give back to my community while staying connected to our Ethiopian heritage.",
            avatar: "MB"
        },
        {
            name: "Daniel Hailu",
            role: "Youth Program Participant",
            content: "The youth programs have helped me develop leadership skills while learning about my culture. I'm proud to be part of HCSEM.",
            avatar: "DH"
        }
    ]

    return (
        <section className="py-20 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                        <span className="text-primary font-semibold text-sm uppercase tracking-wider">Testimonials</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6">
                        What Our <span className="text-gradient">Community Says</span>
                    </h2>

                    <p className="text-lg text-muted-foreground">
                        Hear from the members who make our community strong and vibrant.
                    </p>
                </motion.div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className="h-full hover:border-primary/50 transition-all duration-300 group">
                                <CardContent className="p-8 space-y-6">
                                    <Quote className="w-10 h-10 text-primary/30 group-hover:text-primary/50 transition-colors" />

                                    <p className="text-muted-foreground leading-relaxed">
                                        "{testimonial.content}"
                                    </p>

                                    <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                                            {testimonial.avatar}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-foreground">{testimonial.name}</h4>
                                            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
