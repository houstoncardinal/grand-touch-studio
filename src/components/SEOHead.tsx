import { useEffect } from "react";

interface SEOHeadProps {
  title?: string;
  description?: string;
  path?: string;
}

export const SEOHead = ({ 
  title = "Digital Piano Studio by Siraj Qureshi - Play & Learn Piano Online",
  description = "Professional digital piano studio with realistic grand piano sounds. Learn piano with interactive lessons, play with 5+ instruments including synths & guitars. Free & premium features. Works on all devices worldwide.",
  path = "/"
}: SEOHeadProps) => {
  const siteUrl = "https://grand-touch-studio.lovable.app";
  const canonicalUrl = `${siteUrl}${path}`;

  useEffect(() => {
    document.title = title;
    
    const setMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", description);
    setMeta("keywords", "piano, digital piano, learn piano, online piano, piano lessons, music, keyboard, synthesizer, guitar, bells, Siraj Qureshi, free piano, premium piano, play piano online");
    setMeta("author", "Siraj Qureshi");
    setMeta("robots", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
    
    // Open Graph
    setMeta("og:title", title, true);
    setMeta("og:description", description, true);
    setMeta("og:url", canonicalUrl, true);
    setMeta("og:type", "website", true);
    setMeta("og:site_name", "Digital Piano Studio", true);
    setMeta("og:locale", "en_US", true);
    
    // Twitter
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    
    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);
  }, [title, description, canonicalUrl]);

  return null;
};

export const WebAppSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "name": "Digital Piano Studio",
        "description": "Professional digital piano studio with realistic sounds, interactive lessons, and multiple instruments. Created by Siraj Qureshi.",
        "url": "https://grand-touch-studio.lovable.app",
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Any",
        "browserRequirements": "Requires JavaScript and Web Audio API",
        "offers": [
          {
            "@type": "Offer",
            "name": "Free Plan",
            "price": "0",
            "priceCurrency": "USD",
            "description": "Grand Piano, 3 beginner lessons"
          },
          {
            "@type": "Offer",
            "name": "Premium Monthly",
            "price": "9.99",
            "priceCurrency": "USD",
            "description": "All instruments, all lessons, recording & export"
          },
          {
            "@type": "Offer",
            "name": "Premium Yearly",
            "price": "79.99",
            "priceCurrency": "USD",
            "description": "All instruments, all lessons, recording & export - save 33%"
          }
        ],
        "author": {
          "@type": "Person",
          "name": "Siraj Qureshi"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "ratingCount": "2450",
          "bestRating": "5"
        },
        "featureList": [
          "Realistic Grand Piano Sound",
          "5+ Instruments",
          "Interactive Piano Lessons",
          "32+ Languages Supported",
          "Works on Mobile & Desktop",
          "Recording & Export (Premium)",
          "Advanced Lessons (Premium)"
        ]
      },
      {
        "@type": "Organization",
        "name": "Digital Piano Studio",
        "url": "https://grand-touch-studio.lovable.app",
        "founder": {
          "@type": "Person",
          "name": "Siraj Qureshi"
        },
        "logo": "https://grand-touch-studio.lovable.app/favicon.ico"
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Is Digital Piano Studio free?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! The free plan includes Grand Piano and 3 beginner lessons. Premium plans unlock all instruments, advanced lessons, and recording features starting at $9.99/month."
            }
          },
          {
            "@type": "Question",
            "name": "Can I learn piano online with this app?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Absolutely! Digital Piano Studio offers interactive step-by-step lessons from beginner to advanced, with highlighted keys and real-time feedback."
            }
          },
          {
            "@type": "Question",
            "name": "What instruments are available?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Free users get Grand Piano. Premium users unlock Electric Piano, Synthesizer, Guitar, and Bells."
            }
          },
          {
            "@type": "Question",
            "name": "Does it work on mobile?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, Digital Piano Studio is fully responsive and works on phones, tablets, and desktops with touch and keyboard support."
            }
          }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://grand-touch-studio.lovable.app/" },
          { "@type": "ListItem", "position": 2, "name": "Play Piano", "item": "https://grand-touch-studio.lovable.app/#play" },
          { "@type": "ListItem", "position": 3, "name": "Learn Piano", "item": "https://grand-touch-studio.lovable.app/#learn" },
          { "@type": "ListItem", "position": 4, "name": "Pricing", "item": "https://grand-touch-studio.lovable.app/#pricing" }
        ]
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};