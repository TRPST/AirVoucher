import { AppProps } from "next/app";
import { useRouter } from "next/router";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import "@/styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isProtectedRoute = router.pathname.startsWith("/protected");

  return (
    <>
      {isProtectedRoute ? (
        <DefaultLayout>
          <Component {...pageProps} />
        </DefaultLayout>
      ) : (
        <Component {...pageProps} />
      )}
    </>
  );
}

export default MyApp;
