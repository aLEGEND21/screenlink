"use client";

import { FeatureCard } from "./feature-card";
import {
  Monitor,
  Lock,
  Zap,
  Users,
  Link as LinkIcon,
  Globe,
} from "lucide-react";
import { motion } from "framer-motion";

export function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      title: "Instant Sharing",
      description:
        "Start sharing your screen with just one click. No downloads or installations required.",
    },
    {
      icon: LinkIcon,
      title: "Simple Room Links",
      description:
        "Generate a unique room link that you can share with anyone who needs to see your screen.",
    },
    {
      icon: Globe,
      title: "Works Everywhere",
      description:
        "Share from any modern browser on desktop. Viewers can join from any device.",
    },
    {
      icon: Lock,
      title: "Secure Connection",
      description:
        "End-to-end encrypted WebRTC connections ensure your screen sharing is private and secure.",
    },
    {
      icon: Users,
      title: "Multiple Viewers",
      description:
        "Invite multiple people to view your screen simultaneously with the same room code.",
    },
    {
      icon: Monitor,
      title: "Crisp Quality",
      description:
        "Share your screen in high definition for clear, detailed viewing experience.",
    },
  ];

  return (
    <section className="bg-muted/50 py-20" id="features">
      <div className="px-10 md:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Powerful Features, Simple Experience
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            Screenlink combines powerful capabilities with an intuitive
            interface to make screen sharing effortless.
          </p>
        </motion.div>

        <div className="grid items-stretch gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="h-full"
            >
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
