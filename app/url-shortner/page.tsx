'use client';
import { useState } from 'react';
import { Link2, Copy, Check, Sparkles, ExternalLink, BarChart3, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function URLShortener() {
    const [url, setUrl] = useState('');
    const [shortUrl, setShortUrl] = useState('');
    const [shortCode, setShortCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState('');

    const shortenUrl = async () => {
        if (!url) {
            setError('Please enter a URL');
            return;
        }

        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            setError('URL must start with http:// or https://');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/shorten', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
            });

            const data = await response.json();

            if (response.ok) {
                setShortUrl(`${window.location.origin}/${data.shortCode}`);
                setShortCode(data.shortCode);
            } else {
                setError(data.error || 'Something went wrong');
            }
        } catch (err) {
            setError('Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shortUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            shortenUrl();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 relative overflow-hidden">
            {/* Animated background stars */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="stars"></div>
                <div className="stars2"></div>
                <div className="stars3"></div>
            </div>

            {/* Back button */}
            <div className="relative z-10 pt-8 px-4">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Portfolio</span>
                </Link>
            </div>

            {/* Main content */}
            <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
                <div className="w-full max-w-3xl">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-3 mb-4">
                            <div className="relative">
                                <Link2 className="w-12 h-12 text-violet-400" />
                                <Sparkles className="w-5 h-5 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                            URL Shortener
                        </h1>
                        <p className="text-gray-300 text-lg">
                            Transform long links into cosmic shortcuts ✨
                        </p>
                    </div>

                    {/* Main card */}
                    <div className="bg-gray-800/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-violet-500/20 p-8 md:p-12">
                        <div className="space-y-6">
                            {/* Input */}
                            <div className="relative">
                                <input
                                    type="url"
                                    placeholder="Paste your long URL here..."
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    className="w-full px-6 py-4 bg-gray-900/50 border-2 border-violet-500/30 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-all duration-300 text-lg"
                                />
                                {url && (
                                    <button
                                        onClick={() => setUrl('')}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>

                            {/* Error message */}
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-center">
                                    {error}
                                </div>
                            )}

                            {/* Shorten button */}
                            <button
                                onClick={shortenUrl}
                                disabled={loading || !url}
                                className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-violet-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-violet-500/50 hover:shadow-xl hover:shadow-violet-500/60 transform hover:scale-[1.02]"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Shortening...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        <Sparkles className="w-5 h-5" />
                                        Shorten URL
                                    </span>
                                )}
                            </button>

                            {/* Result */}
                            {shortUrl && (
                                <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 border-2 border-violet-500/30 rounded-2xl p-6 space-y-4 animate-fadeIn">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-gray-400 text-sm mb-2">Your shortened URL:</p>
                                            <a
                                                href={shortUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-violet-400 font-mono text-lg hover:text-violet-300 transition-colors flex items-center gap-2 break-all"
                                            >
                                                {shortUrl}
                                                <ExternalLink className="w-4 h-4 flex-shrink-0" />
                                            </a>
                                        </div>
                                        <button
                                            onClick={copyToClipboard}
                                            className="flex-shrink-0 bg-violet-600 hover:bg-violet-500 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 font-medium"
                                        >
                                            {copied ? (
                                                <>
                                                    <Check className="w-5 h-5" />
                                                    Copied!
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-5 h-5" />
                                                    Copy
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    <div className="pt-4 border-t border-violet-500/20">
                                        <p className="text-gray-400 text-sm">
                                            Original: <span className="text-gray-300 break-all">{url}</span>
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-center space-y-4">
                        <div className="inline-flex items-center gap-2 text-gray-400 text-sm">
                            <BarChart3 className="w-4 h-4" />
                            <span>Analytics & custom domains coming soon</span>
                        </div>

                        <p className="text-gray-500 text-sm">
                            Part of{' '}
                            <Link
                                href="/work"
                                className="text-violet-400 hover:text-violet-300 transition-colors"
                            >
                                my portfolio projects
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div >
    );
}