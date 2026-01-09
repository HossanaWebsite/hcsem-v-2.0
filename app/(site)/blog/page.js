import Link from 'next/link';
import dbConnect from '@/lib/db';
import { Blog, SiteSettings } from '@/models';
import { Calendar, User } from 'lucide-react';
import fs from 'fs';
import path from 'path';

export const revalidate = 60; // Revalidate every minute

async function getBlogs() {
    try {
        await dbConnect();
        return await Blog.find({ isHidden: false }).sort({ createdAt: -1 }).populate('author', 'fullName');
    } catch (error) {
        console.warn("Failed to fetch blogs during build (DB Connection Error):", error.message);
        return [];
    }
}

async function getSettings() {
    try {
        const filePath = path.join(process.cwd(), 'data', 'settings.json');
        const fileData = fs.readFileSync(filePath, 'utf8');
        const defaults = JSON.parse(fileData);

        await dbConnect();
        const settings = await SiteSettings.findOne();
        return settings ? { ...defaults, ...settings.toObject() } : defaults;
    } catch (error) {
        return {};
    }
}

export default async function BlogPage() {
    const blogs = await getBlogs();
    const settings = await getSettings();
    const displayBlogs = blogs.length > 0 ? blogs : (settings.defaultBlogs || []);

    return (
        <div className="min-h-screen py-20 px-6">
            <div className="max-w-7xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="text-5xl font-bold text-gradient">Our Blog</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Insights, updates, and stories from our community.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayBlogs.map((blog) => (
                        <Link key={blog._id || blog.title} href={blog.slug ? `/blog/${blog.slug}` : "/blog"} className="group">
                            <div className="glass-card h-full overflow-hidden flex flex-col">
                                <div className="h-48 bg-muted relative overflow-hidden">
                                    {(blog.coverImage || blog.image) ? (
                                        <img
                                            src={blog.coverImage || blog.image}
                                            alt={blog.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-purple-500/20" />
                                    )}
                                </div>
                                <div className="p-6 flex-1 flex flex-col space-y-4">
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {blog.date || (blog.createdAt && new Date(blog.createdAt).toLocaleDateString()) || 'Recent'}
                                        </div>
                                        {(blog.author && blog.author.fullName) && (
                                            <div className="flex items-center gap-1">
                                                <User className="w-3 h-3" />
                                                {blog.author.fullName}
                                            </div>
                                        )}
                                    </div>
                                    <h2 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">
                                        {blog.title}
                                    </h2>
                                    <p className="text-muted-foreground text-sm line-clamp-3 flex-1">
                                        {blog.summary}
                                    </p>
                                    <div className="pt-4 flex flex-wrap gap-2">
                                        {(blog.tags || []).map(tag => (
                                            <span key={tag} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
