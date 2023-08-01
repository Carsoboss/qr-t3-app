import { type AppType } from "next/app";
import AppLayout from "../components/layouts/app";
import { ClerkProvider } from "@clerk/nextjs";

import { api } from "../utils/api";

import "../styles/globals.css";
import { Toaster } from "react-hot-toast";

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <ClerkProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <AppLayout>
        <Component {...pageProps} />
      </AppLayout>
    </ClerkProvider>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
export default api.withTRPC(MyApp);
