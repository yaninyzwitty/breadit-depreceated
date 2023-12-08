import Providers from "@/components/providers/query-provider";
import AuthProvider from "@/components/session-provider";
import Navbar from "@/components/ui/navbar";
import {Toaster} from "@/components/ui/toaster";
import {getAuthSession} from "@/lib/auth";
import {cn} from "@/lib/utils";
import "@/styles/globals.css";
import {Inter} from "next/font/google";

export const metadata = {
  title: "Breadit",
  description: "A Reddit clone built with Next.js and TypeScript.",
};

const inter = Inter({
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
  authmodal,
}: {
  children: React.ReactNode;
  authmodal: React.ReactNode;
}) {
  const session = await getAuthSession();
  return (
    <html
      lang="en"
      className={cn(`bg-white text-slate-900 antialiased `, inter.className)}
    >
      <body className="min-h-screen pt-12 bg-slate-50 antialiased">
        <Providers>
          {/* @ts-expect-error Server Component 👆🏻 👇🏻 👈🏻 👉🏻 👊🏻 👋🏻 👌 */}
          <Navbar />
          {authmodal}

          <div className="container max-w-7xl mx-auto h-full pt-12">
            <AuthProvider session={session}>{children}</AuthProvider>
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
