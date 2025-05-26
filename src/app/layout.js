import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Velo Antwerpen - Bike Sharing',
  description: 'Find and rent bikes in Antwerpen with our modern bike sharing app',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#ff6b6b" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <main>{children}</main>
      </body>
    </html>
  );
}
