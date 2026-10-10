import Script from "next/script";
export default function MenuCartActions({ children }) {
  return (
    <>
      {children}
      <Script defer src="/menu-cart.js" strategy="lazyOnload" />
    </>
  );
}