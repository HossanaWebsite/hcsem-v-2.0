'use client'
import { Button } from "@/components/ui/Button"
import { motion } from "framer-motion"
import { ArrowRight, Heart, Users, Calendar } from "lucide-react"
import { useState, useEffect } from "react"

export default function Hero() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth) * 20 - 10,
                y: (e.clientY / window.innerHeight) * 20 - 10,
            })
        }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    return (
        <section className="relative min-h-screen w-full overflow-hidden bg-background flex items-center pt-20 lg:pt-0">
            {/* Animated Background Mesh */}
            <div className="absolute inset-0 opacity-30 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/30 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/30 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-[40%] left-[40%] w-[20%] h-[20%] bg-accent/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '4s' }}></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Left Content - Typography */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8 text-center lg:text-left"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                            <Heart className="w-4 h-4 text-primary fill-primary" />
                            <span className="text-primary font-semibold tracking-wider text-sm uppercase">
                                Community First
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-foreground leading-[0.9] tracking-tighter">
                            WE ARE <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary">
                                HOSSAAENA
                            </span>
                        </h1>

                        <p className="text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                            A bridge between cultures. Connecting the vibrant community of Hossaaena City with our new home in Minnesota.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                            <Button size="lg" variant="glow" className="text-lg px-8">
                                Join The Movement
                            </Button>
                            <Button size="lg" variant="outline" className="text-lg px-8">
                                <ArrowRight className="mr-2 w-5 h-5" />
                                Learn More
                            </Button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10 mt-8">
                            <div>
                                <h3 className="text-3xl font-bold text-foreground">1.2k+</h3>
                                <p className="text-sm text-muted-foreground">Members</p>
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-foreground">50+</h3>
                                <p className="text-sm text-muted-foreground">Events</p>
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-foreground">100%</h3>
                                <p className="text-sm text-muted-foreground">Non-Profit</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Content - 3D Visuals */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative hidden lg:block h-[600px]"
                        style={{ perspective: '1000px' }}
                    >
                        {/* Main Image Card */}
                        <div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[500px] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/10 z-20 transition-transform duration-100 ease-out bg-zinc-900"
                            style={{
                                transform: `translate(-50%, -50%) rotateY(${mousePosition.x}deg) rotateX(${-mousePosition.y}deg)`,
                            }}
                        >
                            {/* Placeholder for Image - In production, use next/image */}
                            <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center text-zinc-700">
                                <span className="text-9xl font-black opacity-20">HC</span>
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                            <div className="absolute bottom-8 left-8 right-8">
                                <p className="text-white font-bold text-lg">Cultural Festival 2024</p>
                                <p className="text-white/60 text-sm">Celebrating our heritage</p>
                            </div>
                        </div>

                        {/* Floating Elements */}
                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-20 right-10 w-40 h-40 glass-card z-30 flex items-center justify-center"
                            style={{ transform: `translate(${mousePosition.x * -1.5}px, ${mousePosition.y * -1.5}px)` }}
                        >
                            <div className="text-center">
                                <Users className="w-10 h-10 text-primary mx-auto mb-2" />
                                <p className="font-bold text-foreground">Community</p>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 20, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute bottom-20 left-0 w-64 glass-card z-30"
                            style={{
                                transform: `translate(${mousePosition.x * -1}px, ${mousePosition.y * -1}px)`
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-foreground font-bold text-sm">Next Event</p>
                                    <p className="text-muted-foreground text-xs">Aug 24, 2024</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Decorative Circle */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full -z-10 animate-[spin_10s_linear_infinite]"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] border border-dashed border-white/10 rounded-full -z-10 animate-[spin_15s_linear_infinite_reverse]"></div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
