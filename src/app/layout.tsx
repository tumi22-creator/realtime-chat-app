import "./globals.css";

import SessionProvider from "@/providers/SessionProvider";

export const metadata = {
  title: "Real-Time Chat App",
  description: "Built with Next.js and Socket.IO",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}