import type {MetadataRoute} from 'next';

export const dynamic = 'force-static';

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${appUrl}/sitemap.xml`,
  };
}
