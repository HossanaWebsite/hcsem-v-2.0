'use client'
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function Events() {
    const events = [
        {
            title: "Ethiopian New Year Celebration",
            date: "September 11, 2024",
            location: "Community Center, St. Paul",
            attendees: 250,
            description: "Join us for a vibrant celebration of Enkutatash with traditional food, music, and dance.",
            image: "/api/placeholder/400/300",
            category: "Cultural"
        },
        {
            title: "Youth Leadership Workshop",
            date: "October 15, 2024",
            location: "Minneapolis Convention Center",
            attendees: 80,
            description: "Empowering the next generation with skills and knowledge for community leadership.",
            image: "/api/placeholder/400/300",
            category: "Education"
        },
        {
            title: "Community Fundraiser Gala",
            date: "November 20, 2024",
            location: "Grand Hotel, Minneapolis",
            attendees: 300,
            description: "An elegant evening supporting our community programs and initiatives.",
            image: "/api/placeholder/400/300",
            category: "Fundraiser"
        }
    ]

    return (
        <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                        <span className="text-primary font-semibold text-sm uppercase tracking-wider">Upcoming Events</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6">
                        Join Our <span className="text-gradient">Community Events</span>
                    </h2>

                    <p className="text-lg text-muted-foreground">
                        From cultural celebrations to educational workshops, there's always something happening in our community.
                    </p>
                </motion.div>

                {/* Events Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {events.map((event, index) => (
                        <motion.div
                            key={event.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className="h-full overflow-hidden group hover:border-primary/50 transition-all duration-300">
                                {/* Image Placeholder */}
                                <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute top-4 right-4">
                                        <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                                            {event.category}
                                        </span>
                                    </div>
                                </div>

                                <CardHeader>
                                    <CardTitle className="group-hover:text-primary transition-colors">
                                        {event.title}
                                    </CardTitle>
                                    <CardDescription>{event.description}</CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="w-4 h-4 text-primary" />
                                            <span>{event.date}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <MapPin className="w-4 h-4 text-primary" />
                                            <span>{event.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Users className="w-4 h-4 text-primary" />
                                            <span>{event.attendees} Expected Attendees</span>
                                        </div>
                                    </div>

                                    <Button variant="ghost" className="w-full group/btn">
                                        Learn More
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* View All Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <Link href="/events">
                        <Button size="lg" variant="glow">
                            View All Events
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}
