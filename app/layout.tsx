import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
    title: "Vocabe",
    description: "Una parola al giorno in italiano",
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="it">
            <head>
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#3b82f6" />
            </head>
            <body className="bg-gray-50 text-gray-900 font-sans">
                <main className="max-w-xl mx-auto p-6">{children}</main>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
              if ("serviceWorker" in navigator) {
                window.addEventListener("load", () => {
                  navigator.serviceWorker.register("/sw.js").catch(err => {
                    console.error("Service Worker registration failed:", err);
                  });
                });
              }
            `,
                    }}
                />
            </body>
        </html>
    );
}
