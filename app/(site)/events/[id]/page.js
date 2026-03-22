import { notFound } from 'next/navigation';
import Image from 'next/image';
import dbConnect from '@/lib/db';
import { Event } from '@/models';
import { Calendar, MapPin, ArrowLeft, Clock } from 'lucide-react';
import Link from 'next/link';
import RsvpButton from '@/components/RsvpButton';
import EventCarousel from '@/components/EventCarousel';

async function getEvent(idOrSlug) {
    await dbConnect();
    try {
        // Try finding by ID first if it's a valid ObjectId
        if (idOrSlug && idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
            const event = await Event.findById(idOrSlug);
            if (event) return event;
        }
        // Then try finding by slug
        const event = await Event.findOne({ slug: idOrSlug });
        if (!event) return null;
        return event;
    } catch (e) {
        console.error('Error fetching event:', e);
        return null;
    }
}

// SEO: dynamic metadata per event
export async function generateMetadata({ params }) {
    const event = await getEvent(params.id);
    if (!event) return { title: 'Event | HCSEM' };
    return {
        title: `${event.title} | HCSEM Events`,
        description: event.description?.replace(/<[^>]+>/g, '').slice(0, 160) || event.title,
        openGraph: {
            title: event.title,
            description: event.description?.replace(/<[^>]+>/g, '').slice(0, 160) || '',
            images: event.coverImage ? [{ url: event.coverImage }] : [],
            type: 'website',
        },
    };
}

export default async function EventDetailPage({ params }) {
    const event = await getEvent(params.id);

    if (!event) {
        notFound();
    }

    return (
        <div className="min-h-screen section-spacing container-spacing">
            <article className="max-w-6xl mx-auto space-y-12">
                <Link href="/events" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-lg">
                    <ArrowLeft className="w-5 h-5" />
                    Back to Events
                </Link>

                <header className="space-y-8 text-center">
                    <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {event.date && !isNaN(new Date(event.date).getTime()) 
                                ? new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                                : 'Date TBD'}
                        </div>
                        {event.location && (
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                {event.location}
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {event.date && !isNaN(new Date(event.date).getTime())
                                ? new Date(event.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
                                : 'Time TBD'}
                        </div>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-heading font-bold text-gradient leading-tight">
                        {event.title}
                    </h1>
                    {event.coverImage && (
                        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
                            <Image src={event.coverImage} alt={event.title} fill sizes="(max-width: 1536px) 100vw, 1536px" className="object-cover" />
                        </div>
                    )}
                </header>

                <div className="space-y-16">
                    {/* RSVP Button */}
                    <div className="flex justify-center">
                        <RsvpButton eventId={String(event._id)} rsvpCount={event.rsvps?.length || 0} />
                    </div>

                    {event.layoutTemplate?.toLowerCase() === 'featured' ? (
                        <div className="space-y-12">
                            <div className="prose prose-2xl dark:prose-invert max-w-none text-center font-heading " dangerouslySetInnerHTML={{ __html: event.description }} />
                        </div>
                    ) : event.layoutTemplate?.toLowerCase() === 'minimal' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                            <div className="prose prose-xl dark:prose-invert " dangerouslySetInnerHTML={{ __html: event.description }} />
                            {event.gallery && event.gallery.length > 0 && (
                                <div className="grid grid-cols-2 gap-4">
                                    {event.gallery.slice(0, 4).map((img, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-500">
                                            <Image src={img} alt="" fill className="object-cover" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : event.layoutTemplate?.toLowerCase() === 'gallery' ? (
                        <div className="space-y-12">
                            {event.gallery && event.gallery.length > 0 && (
                                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                                    {event.gallery.map((img, idx) => (
                                        <div key={idx} className="relative rounded-2xl overflow-hidden shadow-xl break-inside-avoid shadow-black/5 animate-in fade-in zoom-in duration-500">
                                            <Image src={img} alt="" width={800} height={600} className="w-full h-auto object-cover" />
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="prose prose-xl dark:prose-invert max-w-none pt-12 border-t border-slate-100 dark:border-white/5 " dangerouslySetInnerHTML={{ __html: event.description }} />
                        </div>
                    ) : event.layoutTemplate?.toLowerCase() === 'carousel' ? (
                        <div className="space-y-12">
                            <div className="prose prose-xl dark:prose-invert max-w-none " dangerouslySetInnerHTML={{ __html: event.description }} />
                            {event.gallery && event.gallery.length > 0 && (
                                <EventCarousel images={event.gallery} />
                            )}
                        </div>
                    ) : event.layoutTemplate?.toLowerCase() === 'hero-overlay' ? (
                        <div className="relative -mt-32 pt-32">
                            <div className="relative z-10 glass-panel p-8 md:p-16 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl">
                                <div className="prose prose-2xl dark:prose-invert max-w-none " dangerouslySetInnerHTML={{ __html: event.description }} />
                            </div>
                        </div>
                    ) : event.layoutTemplate?.toLowerCase() === 'split-view' ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-stretch">
                            <div className="prose prose-xl dark:prose-invert " dangerouslySetInnerHTML={{ __html: event.description }} />
                            <div className="space-y-6">
                                {event.gallery && event.gallery.slice(0, 3).map((img, idx) => (
                                    <div key={idx} className={`relative rounded-3xl overflow-hidden shadow-xl ${idx === 0 ? 'aspect-video' : 'aspect-square w-1/2 inline-block first:mr-6'}`}>
                                        <Image src={img} alt="" fill className="object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : event.layoutTemplate?.toLowerCase() === 'timeline' ? (
                        <div className="space-y-12">
                            <div className="relative border-l-2 border-indigo-500/30 ml-4 pl-12 space-y-12">
                                <div className="relative">
                                    <div className="absolute -left-[54px] top-0 w-4 h-4 rounded-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                                    <div className="prose prose-xl dark:prose-invert max-w-none " dangerouslySetInnerHTML={{ __html: event.description }} />
                                </div>
                                {event.gallery && event.gallery.map((img, idx) => (
                                    <div key={idx} className="relative">
                                        <div className="absolute -left-[54px] top-0 w-4 h-4 rounded-full bg-indigo-500/30" />
                                        <div className="relative h-96 rounded-3xl overflow-hidden shadow-lg">
                                            <Image src={img} alt="" fill className="object-cover" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : event.layoutTemplate?.toLowerCase() === 'magazine' ? (
                        <div className="space-y-16">
                            <div className="columns-1 md:columns-2 gap-12 prose prose-xl dark:prose-invert max-w-none " dangerouslySetInnerHTML={{ __html: event.description }} />
                            {event.gallery && event.gallery.length > 0 && (
                                <div className="grid grid-cols-12 gap-6">
                                    <div className="col-span-12 md:col-span-8 relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
                                        <Image src={event.gallery[0]} alt="" fill className="object-cover" />
                                    </div>
                                    {event.gallery[1] && (
                                        <div className="col-span-12 md:col-span-4 relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl">
                                            <Image src={event.gallery[1]} alt="" fill className="object-cover" />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : event.layoutTemplate?.toLowerCase() === 'video-centric' ? (
                        <div className="space-y-16">
                            <div className="prose prose-2xl dark:prose-invert max-w-3xl mx-auto text-center " dangerouslySetInnerHTML={{ __html: event.description }} />
                            {event.gallery && event.gallery.length > 0 && (
                                <div className="grid grid-cols-1 gap-12">
                                    {event.gallery.slice(0, 2).map((img, idx) => (
                                        <div key={idx} className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                                            <Image src={img} alt="" fill className="object-cover opacity-80" />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-20 h-20 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-2xl scale-110 hover:scale-125 transition-transform cursor-pointer">
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Standard layout */
                        <div className="prose prose-xl dark:prose-invert max-w-none " dangerouslySetInnerHTML={{ __html: event.description }} />
                    )}

                    {/* Additional Gallery Section (if applicable) */}
                    {event.gallery && event.gallery.length > 0 && !['gallery', 'minimal', 'video-centric'].includes(event.layoutTemplate?.toLowerCase()) && (
                        <div className="space-y-8 pt-8 border-t border-slate-100 dark:border-white/5">
                            <h3 className="text-3xl font-bold font-heading text-slate-900 dark:text-white">Event Gallery</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {event.gallery.slice(event.layoutTemplate?.toLowerCase() === 'minimal' ? 4 : 0).map((img, idx) => (
                                    <div key={idx} className="relative rounded-xl overflow-hidden shadow-lg h-64 group">
                                        <Image
                                            src={img}
                                            alt={`Gallery ${idx + 1}`}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className="object-cover hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </article>
        </div>
    );
}
