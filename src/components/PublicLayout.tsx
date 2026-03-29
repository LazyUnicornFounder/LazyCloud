import { useLocation } from "react-router-dom";
import Footer from "@/components/Footer";
import LazyLaunchCTA from "@/components/LazyLaunchCTA";
import VoiceAgentWidget from "@/components/VoiceAgentWidget";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <>
      {children}
      {!isAdmin && <LazyLaunchCTA />}
      {!isAdmin && <Footer />}
      {/* <VoiceAgentWidget /> */}
    </>
  );
}
