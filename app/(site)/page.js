'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import InfiniteScroll from '@/components/InfiniteScroll';
import MiniGallery from '@/components/MiniGallery';
import DonationModal from '@/components/DonationModal';

export default function HomePage() {
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <DonationModal isOpen={isDonationModalOpen} onClose={() => setIsDonationModalOpen(false)} />
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/hero-home.png)' }}
        />
        {/* Theme-aware Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/20 dark:via-background/95 dark:to-background/50" />
        <div className="absolute inset-0 backdrop-blur-[2px] bg-background/5 dark:bg-transparent" />

        <div className="relative z-10 container mx-auto px-8 py-32">
          <div className="max-w-7xl mx-auto">
            {/* Content aligned to left */}
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                <h1 className="text-7xl md:text-8xl font-heading font-bold leading-tight">
                  <span className="text-gradient">HCSEM</span>
                </h1>

                <p className="text-2xl md:text-3xl font-light text-foreground/90 leading-relaxed">
                  Building community.<br />
                  Preserving culture.
                </p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="flex flex-wrap gap-4 pt-4"
                >
                  <Link href="/about">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-primary/25 transition-all"
                    >
                      Learn More
                    </motion.button>
                  </Link>
                  <Link href="/contact?donate=true">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="border-2 border-primary text-primary px-8 py-4 rounded-full font-semibold text-lg hover:bg-primary/10 transition-all"
                    >
                      Donate Now
                    </motion.button>
                  </Link>
                </motion.div>
              </motion.div>

              {/* Stats - Horizontal layout */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="grid grid-cols-3 gap-8 mt-20 pt-12 border-t border-border/50"
              >
                {[
                  { label: 'Members', value: '500+' },
                  { label: 'Events', value: '50+' },
                  { label: 'Years', value: '10+' },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -5 }}
                    className="space-y-2"
                  >
                    <div className="text-4xl font-heading font-bold text-gradient">{stat.value}</div>
                    <div className="text-sm text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-6 h-10 border-2 border-primary rounded-full flex items-start justify-center p-2"
          >
            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Event Gallery - Infinite Scroll */}
      <section className="section-spacing">
        <div className="container mx-auto container-spacing">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-12"
          >
            <h2 className="text-5xl font-heading font-bold">Event Highlights</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Moments from our vibrant community celebrations
            </p>
          </motion.div>

          <InfiniteScroll
            items={[
              { type: 'image', src: '/folder/2.jpg', title: 'Cultural Festival', description: 'Annual celebration of Ethiopian culture' },
              { type: 'image', src: '/folder/3.jpg', title: 'Community Gathering', description: 'Monthly meetup for all members' },
              { type: 'image', src: '/folder/9.jpg', title: 'Youth Program', description: 'Educational workshop for young members' },
              { type: 'image', src: '/folder/10.jpg', title: 'Heritage Day', description: 'Celebrating our rich cultural heritage' },
              { type: 'image', src: '/folder/13.jpg', title: 'Family Event', description: 'Fun activities for the whole family' },
              { type: 'image', src: '/folder/16.jpg', title: 'Achievement Awards', description: 'Recognizing community excellence' },
            ]}
            speed={10}
          />
        </div>
      </section>

      {/* Masonry Gallery */}
      <section className="section-spacing bg-muted/20">
        <div className="container mx-auto container-spacing">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-12"
          >
            <h2 className="text-5xl font-heading font-bold">Community Gallery</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Capturing the spirit of our community through photos
            </p>
          </motion.div>

          <MiniGallery />
        </div>
      </section>

      {/* Upcoming Events - 3 Cards */}
      <section className="section-spacing">
        <div className="container mx-auto container-spacing">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-12"
          >
            <h2 className="text-5xl font-heading font-bold">Upcoming Events</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join us in our upcoming gatherings and celebrations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Cultural Festival 2024', date: 'Dec 15', description: 'Annual celebration featuring traditional music, dance, and food', image: '/event-placeholder.png' },
              { title: 'Community Gathering', date: 'Dec 20', description: 'Monthly meetup for community members to connect', image: '/about-mission.png' },
              { title: 'Youth Education Program', date: 'Dec 25', description: 'Educational workshop for young members', image: '/about-vision.png' }
            ].map((event, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="glass-card overflow-hidden group cursor-pointer"
              >
                <div className="h-56 relative overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-bold">
                    {event.date}
                  </div>
                </div>
                <div className="p-8 space-y-4">
                  <h3 className="text-2xl font-heading font-bold group-hover:text-primary transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {event.description}
                  </p>
                  <Link href="/events" className="inline-flex items-center gap-2 text-primary font-medium">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/events">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-card px-8 py-4 rounded-full font-bold inline-flex items-center gap-3"
              >
                View All Events
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Blog Posts */}
      <section className="section-spacing container-spacing bg-muted/20">
        <div className="max-w-7xl mx-auto space-y-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-4"
          >
            <h2 className="text-5xl font-heading font-bold">Latest Stories</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Insights, updates, and stories from our community
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { id: 1, image: '/blog-placeholder.png' },
              { id: 2, image: '/folder/2.jpg' }
            ].map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, x: post.id === 1 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="glass-card overflow-hidden group cursor-pointer"
              >
                <div className="h-72 relative overflow-hidden">
                  <img
                    src={post.image}
                    alt="Blog post"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-8 space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Dec {post.id}, 2024</span>
                    <span>•</span>
                    <span>5 min read</span>
                  </div>
                  <h3 className="text-3xl font-heading font-bold group-hover:text-primary transition-colors">
                    Sample Blog Post {post.id}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Discover the latest updates and stories from our vibrant community.
                    Learn about our initiatives, events, and the amazing people making a difference.
                  </p>
                  <Link href="/blog" className="inline-flex items-center gap-2 text-primary font-medium">
                    Read More <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/blog">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-card px-8 py-4 rounded-full font-bold inline-flex items-center gap-3"
              >
                View All Posts
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing container-spacing">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto glass-card p-16 text-center space-y-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Join Our Community
            </h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Become a part of something bigger. Connect with fellow Ethiopians and
              help us build a stronger community together.
            </p>
            <div className="flex flex-wrap gap-6 justify-center">
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-primary text-primary-foreground px-10 py-5 rounded-full font-bold text-lg"
                >
                  Get Involved
                </motion.button>
              </Link>
              <Link href="/contact?donate=true">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-primary text-primary px-10 py-5 rounded-full font-bold text-lg"
                >
                  Donate Now
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
