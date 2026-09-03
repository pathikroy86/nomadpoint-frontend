import "./globals.css";
import Footer from "./components/Footer";

export const metadata = {
  title: "NomadPoint",
  description: "Smart remote work location finder and relocation decision platform.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        <Footer />
      </body>
    </html>
  );
}
