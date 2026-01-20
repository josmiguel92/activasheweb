import { defineCollection, z } from "astro:content";

const postsCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    publishedAt: z.date(),
    description: z.string(),
    isPublish: z.boolean(),
    isDraft: z.boolean().default(false),
    image: z.string().optional(),
  }),
});

const projectsCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    publishedAt: z.date(),
    description: z.string(),
    isPublish: z.boolean(),
    isDraft: z.boolean().default(false),
    areas: z.array(z.string()).optional(),
    isComingSoon: z.boolean().optional(),
    image: z.string().optional(),
  }),
});

const artCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    artist: z.string(),
    image: z.string(),
    description: z.string().optional(),
    category: z.enum(["painting", "photography", "sculpture", "digital", "crafts"]),
    year: z.number().optional(),
  }),
});

const videoCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    youtubeId: z.string(),
    featured: z.boolean().default(false),
    category: z.enum(["interviews", "workshops", "documentaries", "events", "education"]),
    duration: z.string(),
    thumbnail: z.string().optional(),
    publishedAt: z.date(),
  }),
});

export const collections = { 
  posts: postsCollection,
  projects: projectsCollection,
  art: artCollection,
  videos: videoCollection
};
