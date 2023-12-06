import { type AppType } from "next/app";
import AppLayout from "../components/layouts/app";
import { ClerkProvider } from "@clerk/nextjs";
import { api } from "../utils/api";
import "../styles/globals.css";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <ClerkProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-center" reverseOrder={false} />
        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>
      </QueryClientProvider>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
