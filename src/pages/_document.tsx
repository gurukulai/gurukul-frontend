
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="application-name" content="Gurukul AI" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Gurukul AI" />
        <meta name="description" content="Your personal AI agents for therapy, diet, career guidance, and more" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#FF6B35" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#FF6B35" />

        <link rel="apple-touch-icon" href="/icons/touch-icon-iphone.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/touch-icon-ipad.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/touch-icon-iphone-retina.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/touch-icon-ipad-retina.png" />

        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#FF6B35" />
        <link rel="shortcut icon" href="/favicon.ico" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://gurukul.ai" />
        <meta name="twitter:title" content="Gurukul AI" />
        <meta name="twitter:description" content="Your personal AI agents for therapy, diet, career guidance, and more" />
        <meta name="twitter:image" content="https://gurukul.ai/icons/android-chrome-192x192.png" />
        <meta name="twitter:creator" content="@gurukulai" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Gurukul AI" />
        <meta property="og:description" content="Your personal AI agents for therapy, diet, career guidance, and more" />
        <meta property="og:site_name" content="Gurukul AI" />
        <meta property="og:url" content="https://gurukul.ai" />
        <meta property="og:image" content="https://gurukul.ai/icons/apple-touch-icon.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
