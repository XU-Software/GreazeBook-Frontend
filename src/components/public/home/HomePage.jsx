"use client";

import React from "react";
import HeroSection from "./HeroSection";
import StatsStrip from "./StatsStrip";
import CTASection from "./CTASection";
import FeaturesSection from "./FeaturesSection";
import HowItWorksSection from "./HowItWorksSection";

const HomePage = () => {
  return (
    <div className="bg-background">
      <HeroSection />
      <StatsStrip />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
    </div>
  );
};

export default HomePage;
