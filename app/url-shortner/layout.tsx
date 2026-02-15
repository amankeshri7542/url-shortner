import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'URL Shortener | Aman Kumar',
    description: 'Transform long URLs into short, shareable links',
};

export default function URLShortenerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}