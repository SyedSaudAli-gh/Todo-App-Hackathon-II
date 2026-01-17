"use client";

import { motion } from "framer-motion";
import { Settings, User, Layout, Zap, LucideIcon } from "lucide-react";
import { LANDING_CONTENT } from "@/lib/constants";
import { featureHoverVariants } from "@/lib/animations";

const iconMap: Record<string, LucideIcon> = {
  Settings,
  User,
  Layout,
  Zap,
};

export function FeaturesSection() {
  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-2xl font-bold md:text-3xl lg:text-4xl">
          {LANDING_CONTENT.features.title}
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          {LANDING_CONTENT.features.items.map((feature) => {
            const Icon = iconMap[feature.icon] || Settings;
            return (
              <motion.article
                key={feature.title}
                variants={featureHoverVariants}
                initial="rest"
                whileHover="hover"
                className="rounded-lg border bg-card p-6 shadow-sm transition-shadow"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
