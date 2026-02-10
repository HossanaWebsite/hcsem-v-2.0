import { notFound } from 'next/navigation';
import Image from 'next/image';
import dbConnect from '@/lib/db';
import { Event } from '@/models';
import { Calendar, MapPin, ArrowLeft, Clock } from 'lucide-react';
import Link from 'next/link';

async function getEvent(id) {
    await dbConnect();
    // Validate ID format if necessary, or let mongoose fail gracefully (or catch error)
    try {
        const event = await Event.findById(id);
        if (!event) return null;
        return event;
    } catch (e) {
        return null;
    }
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
                            {new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                        {event.location && (
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                {event.location}
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {new Date(event.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
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
                    {/* Render Rich Text Description */}
                    <div className="prose prose-xl dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: event.description }} />

                    {/* Gallery Section */}
                    {event.gallery && event.gallery.length > 0 && (
                        <div className="space-y-8">
                            <h3 className="text-3xl font-bold font-heading">Gallery</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {event.gallery.map((img, idx) => (
                                    <div key={idx} className="relative rounded-xl overflow-hidden shadow-lg h-64">
                                        <Image src={img} alt={`Gallery ${idx + 1}`} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover hover:scale-105 transition-transform duration-500" />
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
