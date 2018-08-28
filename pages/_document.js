import React from "react";
import Document, {
  Head,
  Main,
  NextScript
} from "next/document";
import flush from "styled-jsx/server";

export default class MyDocument extends Document {

  static async getInitialProps(ctx) {
    return Document.getInitialProps(ctx);
  }

  render() {
    // make the environment available on the client
    const envScript = `window.ENV = '${process.env.WILD_ENV || "development"}';`;
    return (
      <html lang="en">
        <Head>
          <link rel="shortcut icon" href="/static/common/favicon.ico" />
          <link rel="icon" href="/static/common/favicon.png" />
          <script dangerouslySetInnerHTML={{__html: envScript}} />
          { /* General */ }
          <meta charset="utf-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
          <meta name="theme-color" content="#ffffff" />
          <link rel="dns-prefetch" href="//fonts.googleapis.com/" />
          { /* Fonts */ }
          <link href="https://fonts.googleapis.com/css?family=Poppins:400,700,900" rel="stylesheet"/>
          <link href="https://fonts.googleapis.com/css?family=Karla:400,700" rel="stylesheet"/>
          { /* Title Desc. */ }
          <meta name="description" content="A free daily text to expand your mind - Choose your favorite topics, desired length, contact info. and look out for your daily bit of knowledge!" />
          { /* Social */ }
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="A Daily Byte - A Daily Text To Expand Your Mind" />
          <meta name="twitter:description" content="A free daily text to expand your mind - Choose your favorite topics, desired length, contact info. and look out for your daily bit of knowledge!" />
          <meta name="twitter:image:src" content="https://adailybyte.com/static/common/social.jpg" />
          <meta property="og:title" content="A Tiny Byte - A daily text to expand your mind." />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="https://adailybyte.com/static/common/social.jpg" />
          <meta property="og:locale" content="en_US" />
          <meta property="og:description" content="A free daily text to expand your mind - Choose your favorite topics, desired length, contact info. and look out for your daily bit of knowledge!" />
          { /* Analytics */ }
          <script type="text/javascript" async="" src="https://www.google-analytics.com/analytics.js"></script>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
            __html: (
              `
              {
                "@context": "http://schema.org/",
                "@type": "Product",
                "name": "My daily PLANNER",
                "url": "https://paulina.website/daily-planner/",
                "image": "https://paulina.website/daily-planner/images/social.jpg",
                "description": "Free printable template, which will help you effectively organize your day.",
                "offers": {
                  "@type": "Offer",
                  "priceCurrency": "USD",
                  "price": "0",
                  "availability": "http://schema.org/InStock"
                }
              }
              `
            )
          }} />
          <script async="" src="https://www.googletagmanager.com/gtag/js?id=UA-117743892-2"></script>
          <script
            dangerouslySetInnerHTML={{
            __html: (
              `
                window.dataLayer = window.dataLayer || [];
                function gtag(){
                  dataLayer.push(arguments);
                }
                gtag('js', new Date());

                gtag('config', 'UA-124716183-1');
              `
            )
          }} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }

}
