export const dynamic = 'force-dynamic';
import dbConnect from '@/lib/db';
import { Event, Blog } from '@/models';

export default async function sitemap() {
  const baseUrl = 'https://ahcsemn.org';

  try {
    await dbConnect();

    // Fetch all active events and blogs, lean() is faster and just returns generic javascript objects
    const events = await Event.find({}).lean() || [];
    const blogs = await Blog.find({}).lean() || [];

    const eventUrls = events.map((event) => ({
      url: `${baseUrl}/events/${event._id}`,
      lastModified: event.updatedAt || event.date || new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    const blogUrls = blogs.map((blog) => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: blog.updatedAt || blog.createdAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1, // Highest priority for Home Page
      },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/events`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/contact`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      ...eventUrls,
      ...blogUrls,
    ];
  } catch (error) {
    console.error("Failed to generate sitemap", error);
    // Return a fallback static sitemap if DB fails during build
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ];
  }
}
