import { notFound } from 'next/navigation';
import Image from 'next/image';
import dbConnect from '@/lib/db';
import { Event } from '@/models';
import { Calendar, MapPin, ArrowLeft, Clock } from 'lucide-react';
import Link from 'next/link';
import RsvpButton from '@/components/RsvpButton';
import ShareEvent from '@/components/ShareEvent';
import EventCarousel from '@/components/EventCarousel';

async function getEvent(slug) {
    await dbConnect();
    try {
        // Try slug first (preferred), fall back to ID for backward compat
        let event = await Event.findOne({ slug }).lean();
        if (!event && slug.match(/^[0-9a-fA-F]{24}$/)) {
            event = await Event.findById(slug).lean();
        }
        if (event) {
            if (event.coverImage) event.coverImage = event.coverImage.replace(/\/next\/img(\/url)?/g, '/uploads');
            if (event.gallery) event.gallery = event.gallery.map(img => img.replace(/\/next\/img(\/url)?/g, '/uploads'));
            if (event.description) event.description = event.description.replace(/\/next\/img(\/url)?/g, '/uploads');
        }
        return event || null;
    } catch (e) {
        console.error('Error fetching event:', e);
        return null;
    }
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const event = await getEvent(slug);
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
    const { slug } = await params;
    const event = await getEvent(slug);

    if (!event) notFound();

    const layout = event.layoutTemplate?.toLowerCase() || 'standard';
    const gallery = event.gallery || [];
    const rsvpEnabled = event.rsvpEnabled !== false; // default true

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
                            <Image src={event.coverImage} alt={event.title} fill sizes="(max-width: 1536px) 100vw, 1536px" className="object-cover" unoptimized={typeof event.coverImage === 'string' && event.coverImage.startsWith('/uploads')} />
                        </div>
                    )}
                </header>

                <div className="space-y-16">
                    <div className="flex flex-col items-center justify-center gap-4">
                        {rsvpEnabled && (
                            <RsvpButton eventId={String(event._id)} rsvpCount={event.rsvps?.length || 0} />
                        )}
                        <ShareEvent title={event.title} description={event.description?.replace(/<[^>]+>/g, '').slice(0, 160) || ''} />
                    </div>

                    {layout === 'featured' ? (
                        <div className="prose prose-2xl dark:prose-invert max-w-none text-center font-heading" dangerouslySetInnerHTML={{ __html: event.description || '' }} />
                    ) : layout === 'minimal' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                            <div className="prose prose-xl dark:prose-invert" dangerouslySetInnerHTML={{ __html: event.description || '' }} />
                            {gallery.length > 0 && (
                                <div className="grid grid-cols-2 gap-4">
                                    {gallery.slice(0, 4).map((img, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-500">
                                            <Image src={img} alt="" fill className="object-cover" unoptimized={typeof img === 'string' && img.startsWith('/uploads')} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : layout === 'gallery' ? (
                        <div className="space-y-12">
                            {gallery.length > 0 && (
                                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                                    {gallery.map((img, idx) => (
                                        <div key={idx} className="relative rounded-2xl overflow-hidden shadow-xl break-inside-avoid">
                                            <Image src={img} alt="" width={800} height={600} className="w-full h-auto object-cover" unoptimized={typeof img === 'string' && img.startsWith('/uploads')} />
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="prose prose-xl dark:prose-invert max-w-none pt-12 border-t border-slate-100 dark:border-white/5" dangerouslySetInnerHTML={{ __html: event.description || '' }} />
                        </div>
                    ) : layout === 'carousel' ? (
                        <div className="space-y-12">
                            <div className="prose prose-xl dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: event.description || '' }} />
                            {gallery.length > 0 && <EventCarousel images={gallery} />}
                        </div>
                    ) : layout === 'hero-overlay' ? (
                        <div className="relative -mt-32 pt-32">
                            <div className="relative z-10 glass-panel p-8 md:p-16 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl">
                                <div className="prose prose-2xl dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: event.description || '' }} />
                            </div>
                        </div>
                    ) : layout === 'split-view' ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-stretch">
                            <div className="prose prose-xl dark:prose-invert" dangerouslySetInnerHTML={{ __html: event.description || '' }} />
                            <div className="space-y-6">
                                {gallery.slice(0, 3).map((img, idx) => (
                                    <div key={idx} className={`relative rounded-3xl overflow-hidden shadow-xl ${idx === 0 ? 'aspect-video' : 'aspect-square w-1/2 inline-block first:mr-6'}`}>
                                        <Image src={img} alt="" fill className="object-cover" unoptimized={typeof img === 'string' && img.startsWith('/uploads')} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : layout === 'timeline' ? (
                        <div className="relative border-l-2 border-indigo-500/30 ml-4 pl-12 space-y-12">
                            <div className="relative">
                                <div className="absolute -left-[54px] top-0 w-4 h-4 rounded-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                                <div className="prose prose-xl dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: event.description || '' }} />
                            </div>
                            {gallery.map((img, idx) => (
                                <div key={idx} className="relative">
                                    <div className="absolute -left-[54px] top-0 w-4 h-4 rounded-full bg-indigo-500/30" />
                                    <div className="relative h-96 rounded-3xl overflow-hidden shadow-lg">
                                        <Image src={img} alt="" fill className="object-cover" unoptimized={typeof img === 'string' && img.startsWith('/uploads')} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : layout === 'magazine' ? (
                        <div className="space-y-16">
                            <div className="columns-1 md:columns-2 gap-12 prose prose-xl dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: event.description || '' }} />
                            {gallery.length > 0 && (
                                <div className="grid grid-cols-12 gap-6">
                                    <div className="col-span-12 md:col-span-8 relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
                                        <Image src={gallery[0]} alt="" fill className="object-cover" unoptimized={typeof gallery[0] === 'string' && gallery[0].startsWith('/uploads')} />
                                    </div>
                                    {gallery[1] && (
                                        <div className="col-span-12 md:col-span-4 relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl">
                                            <Image src={gallery[1]} alt="" fill className="object-cover" unoptimized={typeof gallery[1] === 'string' && gallery[1].startsWith('/uploads')} />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : layout === 'video-centric' ? (
                        <div className="space-y-16">
                            <div className="prose prose-2xl dark:prose-invert max-w-3xl mx-auto text-center" dangerouslySetInnerHTML={{ __html: event.description || '' }} />
                            {gallery.length > 0 && (
                                <div className="grid grid-cols-1 gap-12">
                                    {gallery.slice(0, 2).map((img, idx) => (
                                        <div key={idx} className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                                            <Image src={img} alt="" fill className="object-cover opacity-80" unoptimized={typeof img === 'string' && img.startsWith('/uploads')} />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-20 h-20 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-2xl scale-110 hover:scale-125 transition-transform cursor-pointer">
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="prose prose-xl dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: event.description || '' }} />
                    )}

                    {gallery.length > 0 && !['gallery', 'minimal', 'video-centric'].includes(layout) && (
                        <div className="space-y-8 pt-8 border-t border-slate-100 dark:border-white/5">
                            <h3 className="text-3xl font-bold font-heading">Event Gallery</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {gallery.map((img, idx) => (
                                    <div key={idx} className="relative rounded-xl overflow-hidden shadow-lg h-64">
                                        <Image src={img} alt={`Gallery ${idx + 1}`} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover hover:scale-105 transition-transform duration-500" unoptimized={typeof img === 'string' && img.startsWith('/uploads')} />
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
