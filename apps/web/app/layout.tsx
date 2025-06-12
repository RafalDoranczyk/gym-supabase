import { APP_DESCRIPTION, APP_NAME } from "@/constants";
import { AppProviders, fonts } from "@/providers";
import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className={fonts.variable}>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
