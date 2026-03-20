import { motion } from "framer-motion";

const TwitterFeed = () => {
  return (
    <section className="relative z-10 px-8 md:px-12 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl bg-background/60 backdrop-blur-2xl rounded-3xl px-8 py-10 border border-foreground/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
      >
        <p className="font-display text-3xl md:text-4xl font-extrabold tracking-[0.1em] uppercase text-foreground/60 mb-6">
          Feed
        </p>
        <div className="rounded-2xl overflow-hidden">
          <iframe
            src="https://syndication.twitter.com/srv/timeline-profile/screen-name/SaadSahawneh?dnt=true&embedId=twitter-widget-0&frame=false&hideBorder=true&hideFooter=true&hideHeader=true&hideScrollBar=false&lang=en&theme=dark&transparent=true"
            className="w-full border-0 rounded-2xl"
            style={{ height: 500, colorScheme: "dark" }}
            sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            title="@SaadSahawneh on X"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default TwitterFeed;
