"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LANDING_CONTENT } from "@/lib/constants";
import { heroVariants } from "@/lib/animations";

export function HeroSection() {
  const router = useRouter();

  return (
    <section className="px-4 py-12 text-center md:py-16 lg:py-24">
      <div className="container mx-auto max-w-4xl">
        <motion.h1
          custom={0}
          initial="hidden"
          animate="visible"
          variants={heroVariants}
          className="text-3xl font-bold md:text-4xl lg:text-5xl xl:text-6xl"
        >
          {LANDING_CONTENT.hero.headline}
        </motion.h1>

        <motion.p
          custom={1}
          initial="hidden"
          animate="visible"
          variants={heroVariants}
          className="mt-4 text-base text-muted-foreground md:mt-6 md:text-lg lg:text-xl"
        >
          {LANDING_CONTENT.hero.subheading}
        </motion.p>

        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={heroVariants}
          className="mt-6 flex flex-col gap-3 md:mt-8 md:flex-row md:justify-center md:gap-4"
        >
          <Button
            size="lg"
            onClick={() => router.push("/signup")}
            className="text-base md:text-lg"
          >
            {LANDING_CONTENT.hero.primaryCTA}
          </Button>
          {LANDING_CONTENT.hero.secondaryCTA && (
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                // Scroll to showcase section
                document.getElementById("showcase")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-base md:text-lg"
            >
              {LANDING_CONTENT.hero.secondaryCTA}
            </Button>
          )}
        </motion.div>
      </div>
    </section>
  );
}
