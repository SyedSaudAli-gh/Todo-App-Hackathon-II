"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LANDING_CONTENT } from "@/lib/constants";

export function CTASection() {
  const router = useRouter();

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 p-8 text-center md:p-12 lg:p-16">
          <h2 className="text-2xl font-bold md:text-3xl lg:text-4xl">
            {LANDING_CONTENT.cta.headline}
          </h2>
          <Button
            size="lg"
            onClick={() => router.push("/signup")}
            className="mt-6 text-base md:text-lg"
          >
            {LANDING_CONTENT.cta.buttonText}
          </Button>
        </div>
      </div>
    </section>
  );
}
