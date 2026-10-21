/**
 * Base path the app is served under ('' at a domain root, '/pdf-generator'
 * on the GitHub Pages project site). Set via NEXT_PUBLIC_BASE_PATH at build
 * time and inlined by Next.js. Use it for public/ asset URLs, which Next does
 * not prefix automatically.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
