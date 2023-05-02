import React from 'react';
import Head from 'next/head';

interface CustomHeadProps {
    title: string;
    description: string;
    ogImage?: string;
    twitterImage?: string;
}

const CustomHead: React.FC<CustomHeadProps> = ({
    title,
    description,
    ogImage,
    twitterImage,
}) => {
    return (
        <Head>
            <title>{title}</title>
            <meta name="description" content={description} />

            {/* Favicons */}
            <link rel="manifest" href="/favicons/site.webmanifest" />
            <link
                rel="apple-touch-icon"
                sizes="180x180"
                href="/favicons/apple-touch-icon.png"
            />
            <link
                rel="icon"
                type="image/png"
                sizes="32x32"
                href="/favicons/favicon-32x32.png"
            />
            <link
                rel="icon"
                type="image/png"
                sizes="16x16"
                href="/favicons/favicon-16x16.png"
            />
            <link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#5bbad5" />
            <meta name="theme-color" content="#ffffff" />

            {/* Open Graph metadata */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            {ogImage && <meta property="og:image" content={ogImage} />}

            {/* Twitter metadata */}
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:card" content="summary_large_image" />
            {twitterImage && <meta name="twitter:image" content={twitterImage} />}
        </Head>
    );
};

export default CustomHead;
