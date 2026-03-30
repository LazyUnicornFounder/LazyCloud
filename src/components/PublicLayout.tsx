import { useLocation } from "react-router-dom";
import Footer from "@/components/Footer";
import LazyLaunchCTA from "@/components/LazyLaunchCTA";
import VoiceAgentWidget from "@/components/VoiceAgentWidget";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const isDocs = location.pathname.startsWith("/docs");

  return (
    <>
      {children}
      {!isAdmin && !isDocs && <LazyLaunchCTA />}
      {!isAdmin && !isDocs && <Footer />}
      {/* <VoiceAgentWidget /> */}
    </>
  );
}
