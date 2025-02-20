import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import store from "@/store/store";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Plus_Jakarta_Sans,
  Poppins,
  Nunito,
  Itim,
  Space_Grotesk,
  Onest,
  Sen,
  Inter,
  Barlow_Semi_Condensed,
  Urbanist,
  Cherry_Swash,
  Be_Vietnam_Pro,
  Bungee_Inline,
  Jost,
  Montserrat,
  Lexend,
} from "next/font/google";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
// import ResponseInterceptor from "@/utilities/ResponseInterceptor";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const plus_jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});
const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["200", "300", "400", "600", "700", "800"],
});

const itim = Itim({
  subsets: ["latin"],
  variable: "--font-itim",
  weight: ["400"],
});

const space_grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
});
const onest = Onest({
  subsets: ["latin"],
  variable: "--font-onest",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  adjustFontFallback: false,
});

const sen = Sen({
  subsets: ["latin"],
  variable: "--font-sen",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  adjustFontFallback: false,
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const barlow_semi_condensed = Barlow_Semi_Condensed({
  subsets: ["latin"],
  variable: "--font-barlow-semi-condensed",
  weight: ["400", "500", "600", "700", "800"],
});

const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
  weight: ["400", "500", "600", "700", "800"],
});

const cherry_swash = Cherry_Swash({
  subsets: ["latin"],
  variable: "--font-cherry-swash",
  weight: ["400", "700"],
  display: "swap",
  adjustFontFallback: false,
});
const vietnam_pro = Be_Vietnam_Pro({
  subsets: ["latin"],
  variable: "--font-vietnam-pro",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  adjustFontFallback: false,
});

const bungee_inline = Bungee_Inline({
  subsets: ["latin"],
  variable: "--font-bungee-inline",
  weight: ["400"],
  display: "swap",
  adjustFontFallback: false,
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  weight: ["400", "500", "600", "700", "800", "900", "100", "200", "300"],
  display: "swap",
  adjustFontFallback: false,
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700", "800", "900", "100", "200", "300"],
  display: "swap",
  adjustFontFallback: false,
});

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
  weight: ["400", "500", "600", "700", "800", "900", "100", "200", "300"],
  display: "swap",
  adjustFontFallback: false,
});

const persistor = persistStore(store);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      {/* <ResponseInterceptor /> */}
      <PersistGate persistor={persistor}>
        <style jsx global>{`
          body {
            font-family: ${plus_jakarta.style.fontFamily};
          }
        `}</style>
        <div
          className={`${poppins.variable} ${plus_jakarta.variable} ${nunito.variable} ${itim.variable} ${space_grotesk.variable} ${onest.variable} ${sen.variable} ${inter.variable} ${barlow_semi_condensed.variable} ${urbanist.variable}
        ${cherry_swash.variable} ${vietnam_pro.variable} ${bungee_inline.variable} ${jost.variable} ${montserrat.variable} ${lexend.variable}`}
        >
          <Component {...pageProps} />
        </div>
        <ToastContainer 
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"/>
      </PersistGate>
    </Provider>
  );
}
