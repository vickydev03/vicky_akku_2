import localFont from "next/font/local";

export const openSauce = localFont({
  src: [
    { path: "../../public/fonts/OpenSauceOne-Medium.ttf", weight: "500" },
    { path: "../../public/fonts/OpenSauceOne-Light.ttf", weight: "300" },
    { path: "../../public/fonts/OpenSauceSans-Bold.ttf", weight: "700" },
    { path: "../../public/fonts/OpenSauceOne-BlackItalic.ttf", weight: "900" },
  ],
  variable: "--font-open-sauce",
  display: "swap",
});
