import { notFound } from 'next/navigation';
import Image from 'next/image';
import dbConnect from '@/lib/db';
import { Blog } from '@/models';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { getCurrentUser } from '@/lib/auth';

async function getBlog(slug) {
    await dbConnect();

    const cookieStore = await cookies();
    // getCurrentUser expects a request-like object with cookies.get
    // cookieStore has .get().
    const user = await getCurrentUser({ cookies: cookieStore });
    const isAdmin = user && (user.role?.name === 'Admin' || user.role?.permissions?.includes('manage_blogs'));

    const query = { slug };
    if (!isAdmin) {
        query.isHidden = { $ne: true };
    }

    const blog = await Blog.findOne(query).populate('author', 'fullName');
    if (!blog) return null;
    return blog;
}

export default async function BlogDetailPage({ params }) {
    const blog = await getBlog(params.slug);

    if (!blog) {
        notFound();
    }

    return (
        <div className="min-h-screen section-spacing container-spacing">
            <article className="max-w-6xl mx-auto space-y-16">
                <Link href="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-lg">
                    <ArrowLeft className="w-5 h-5" />
                    Back to Blogs
                </Link>

                <header className="space-y-8 text-center">
                    <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(blog.createdAt).toLocaleDateString()}
                        </div>
                        {blog.author && (
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                {blog.author.fullName}
                            </div>
                        )}
                    </div>
                    <h1 className="text-5xl md:text-7xl font-heading font-bold text-gradient leading-tight">
                        {blog.title}
                    </h1>
                    {blog.coverImage && (
                        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
                            <Image src={blog.coverImage} alt={blog.title} fill sizes="(max-width: 1536px) 100vw, 1536px" className="object-cover" />
                        </div>
                    )}
                </header>

                <div className="space-y-16">
                    {blog.content ? (
                        <div className="prose prose-xl dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: blog.content }} />
                    ) : (
                        blog.blocks.map((block) => (
                            <div key={block._id} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                                {/* Single Text */}
                                {block.type === 'text' && (
                                    <div className="prose prose-xl dark:prose-invert max-w-none">
                                        <p className="whitespace-pre-wrap leading-relaxed text-lg">{block.content}</p>
                                    </div>
                                )}

                                {/* Single Image */}
                                {block.type === 'image' && (
                                    <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl">
                                        <Image src={block.content} alt="" fill sizes="(max-width: 1536px) 100vw, 1536px" className="object-cover" />
                                    </div>
                                )}

                                {/* Text + Image Split */}
                                {block.type === 'split' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                                        <div className="prose prose-lg dark:prose-invert">
                                            <p className="whitespace-pre-wrap leading-relaxed">{block.content.text}</p>
                                        </div>
                                        <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl">
                                            <Image src={block.content.image} alt="" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                                        </div>
                                    </div>
                                )}

                                {/* Parallel Text (2 Columns) */}
                                {block.type === 'parallel-text' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        <div className="prose prose-lg dark:prose-invert">
                                            <p className="whitespace-pre-wrap leading-relaxed">{block.content.left}</p>
                                        </div>
                                        <div className="prose prose-lg dark:prose-invert">
                                            <p className="whitespace-pre-wrap leading-relaxed">{block.content.right}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Parallel Images (2 Columns) */}
                                {block.type === 'parallel-images' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl">
                                            <Image src={block.content.left} alt="" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                                        </div>
                                        <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl">
                                            <Image src={block.content.right} alt="" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                                        </div>
                                    </div>
                                )}

                                {/* Triple Column */}
                                {block.type === 'triple' && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <div className="prose dark:prose-invert">
                                            <p className="whitespace-pre-wrap leading-relaxed">{block.content.left}</p>
                                        </div>
                                        <div className="prose dark:prose-invert">
                                            <p className="whitespace-pre-wrap leading-relaxed">{block.content.center}</p>
                                        </div>
                                        <div className="prose dark:prose-invert">
                                            <p className="whitespace-pre-wrap leading-relaxed">{block.content.right}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )))}
                </div>
            </article >
        </div >
    );
}

