'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamic imports for heavy components to reduce initial bundle size
const InfiniteScroll = dynamic(() => import('@/components/InfiniteScroll'), {
  loading: () => <div className="h-96 animate-pulse bg-muted/20 rounded-3xl" />
});
const MiniGallery = dynamic(() => import('@/components/MiniGallery'), {
  loading: () => <div className="h-96 animate-pulse bg-muted/20 rounded-3xl" />
});
const DonationModal = dynamic(() => import('@/components/DonationModal'));
const PhotoTicker = dynamic(() => import('@/components/PhotoTicker'), {
  loading: () => <div className="h-32 animate-pulse bg-muted/20" />
});

export default function HomePage() {
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [settings, setSettings] = useState({
    heroTitle: 'HCSEM',
    heroSubtitle: 'Building community.\nPreserving culture.',
    eventsTitle: 'Event Highlights',
    eventsSubtitle: 'Moments from our vibrant community celebrations',
    stats: [
      { label: 'Members', value: '500+' },
      { label: 'Events', value: '50+' },
      { label: 'Years', value: '10+' },
    ],
    tickerImages: [],
    galleryImages: [],
    defaultEvents: [],
    defaultBlogs: [],
    showHero: true,
    showStats: true,
    showEventsHighlight: true,
    showCommunityGallery: true,
    showUpcomingEvents: true
  });

  const [realEvents, setRealEvents] = useState([]);
  const [realBlogs, setRealBlogs] = useState([]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          setSettings({
            ...data,
            stats: data.stats || [
              { label: 'Members', value: '500+' },
              { label: 'Events', value: '50+' },
              { label: 'Years', value: '10+' },
            ],
            tickerImages: data.tickerImages || [],
            galleryImages: data.galleryImages || [],
            defaultEvents: data.defaultEvents || [],
            defaultBlogs: data.defaultBlogs || [],
            showHero: data.showHero !== undefined ? data.showHero : true,
            showStats: data.showStats !== undefined ? data.showStats : true,
            showEventsHighlight: data.showEventsHighlight !== undefined ? data.showEventsHighlight : true,
            showCommunityGallery: data.showCommunityGallery !== undefined ? data.showCommunityGallery : true,
            showUpcomingEvents: data.showUpcomingEvents !== undefined ? data.showUpcomingEvents : true
          });
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      }
    };

    const fetchData = async () => {
      try {
        const [eventsRes, blogsRes] = await Promise.all([
          fetch('/api/events'),
          fetch('/api/blogs')
        ]);
        if (eventsRes.ok) {
          const data = await eventsRes.json();
          if (data.success) setRealEvents(data.data.filter(e => !e.isHidden).slice(0, 3));
        }
        if (blogsRes.ok) {
          const data = await blogsRes.json();
          if (data.success) setRealBlogs(data.data.filter(b => !b.isHidden).slice(0, 2));
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchSettings();
    fetchData();
  }, []);

  return (
    <div className="min-h-screen">
      <DonationModal isOpen={isDonationModalOpen} onClose={() => setIsDonationModalOpen(false)} />
      {/* Hero Section */}
      {settings.showHero && (
        <section className="relative min-h-screen flex items-center overflow-hidden">
          {/* Background Image with Overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${settings.heroImage || '/hero-home.png'})` }}
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
                    <span className="text-gradient whitespace-pre-line">{settings.heroTitle}</span>
                  </h1>

                  <p className="text-2xl md:text-3xl font-light text-foreground/90 leading-relaxed whitespace-pre-line">
                    {settings.heroSubtitle}
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
                {settings.showStats && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="grid grid-cols-3 gap-8 mt-20 pt-12 border-t border-border/50"
                  >
                    {(settings.stats && settings.stats.length > 0 ? settings.stats : [
                      { label: 'Members', value: '500+' },
                      { label: 'Events', value: '50+' },
                      { label: 'Years', value: '10+' },
                    ]).map((stat, i) => (
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
                )}
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
      )}



      {/* Event Gallery - Infinite Scroll */}
      {settings.showEventsHighlight && (
        <section className="section-spacing">
          <div className="container mx-auto container-spacing">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center space-y-4 mb-12"
            >
              <h2 className="text-5xl font-heading font-bold">{settings.eventsTitle}</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {settings.eventsSubtitle}
              </p>
            </motion.div>

            <InfiniteScroll
              items={(settings.tickerImages && settings.tickerImages.length > 0) ? settings.tickerImages
                .filter(img => img.url && img.url.trim() !== '')
                .map(img => ({
                  type: 'image',
                  src: img.url,
                  title: img.title || '',
                  description: img.subtitle || ''
                })) : [
                { type: 'image', src: '/images/defaults/community-1.png', title: 'Cultural Festival', description: 'Annual celebration' },
                { type: 'image', src: '/images/defaults/community-2.png', title: 'Community Feast', description: 'Sharing traditions' },
                { type: 'image', src: '/images/defaults/community-3.png', title: 'Traditional Dance', description: 'Cultural heritage' },
                { type: 'image', src: '/images/defaults/event-1.png', title: 'Gathering', description: 'Community spirit' },
              ]}
              speed={10}
            />
          </div>
        </section>
      )}

      {/* Masonry Gallery */}
      {settings.showCommunityGallery && (
        <section className="section-spacing bg-muted/20">
          <div className="container mx-auto container-spacing">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center space-y-4 mb-12"
            >
              <h2 className="text-5xl font-heading font-bold">{settings.galleryTitle || 'Community Gallery'}</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {settings.gallerySubtitle || 'Capturing the spirit of our community through photos'}
              </p>
            </motion.div>

            <MiniGallery images={settings.galleryImages} />
          </div>
        </section>
      )}

      {/* Upcoming Events - 3 Cards */}
      {settings.showUpcomingEvents && (
        <section className="section-spacing">
          <div className="container mx-auto container-spacing">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center space-y-4 mb-12"
            >
              <h2 className="text-5xl font-heading font-bold">{settings.upcomingEventsTitle || 'Upcoming Events'}</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {settings.upcomingEventsSubtitle || 'Join us in our upcoming gatherings and celebrations'}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(realEvents.length > 0 ? realEvents : settings.defaultEvents).map((event, i) => (
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
                    <Image
                      src={event.image || event.coverImage || '/event-placeholder.png'}
                      alt={event.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-bold">
                      {event.date && (typeof event.date === 'string' ? event.date : new Date(event.date).toLocaleDateString())}
                    </div>
                  </div>
                  <div className="p-8 space-y-4">
                    <h3 className="text-2xl font-heading font-bold group-hover:text-primary transition-colors line-clamp-1">
                      {event.title}
                    </h3>
                    <p className="text-muted-foreground line-clamp-2">
                      {event.description}
                    </p>
                    <Link href={event.slug ? `/events/${event.slug}` : "/events"} className="inline-flex items-center gap-2 text-primary font-medium">
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
      )}

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
            {(realBlogs.length > 0 ? realBlogs : settings.defaultBlogs).map((post, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="glass-card overflow-hidden group cursor-pointer"
              >
                <div className="h-72 relative overflow-hidden">
                  <Image
                    src={post.image || post.coverImage || '/blog-placeholder.png'}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-8 space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{post.date || (post.publishedAt && new Date(post.publishedAt).toLocaleDateString()) || 'Recent'}</span>
                    <span>•</span>
                    <span>5 min read</span>
                  </div>
                  <h3 className="text-3xl font-heading font-bold group-hover:text-primary transition-colors line-clamp-1">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed line-clamp-2">
                    {post.summary}
                  </p>
                  <Link href={post.slug ? `/blog/${post.slug}` : "/blog"} className="inline-flex items-center gap-2 text-primary font-medium">
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
