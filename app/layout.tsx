import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Time Card Room | Bookchaowalit", description: "A local browser stopwatch for work sessions." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
