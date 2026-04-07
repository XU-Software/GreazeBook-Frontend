import Link from "next/link";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import OrderPipelineCard from "./OrderPipelineCard";

export default function HeroSection() {
  return (
    <section className="pt-28 pb-20 lg:pt-36 lg:pb-28 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 bg-secondary text-primary text-xs font-medium px-4 py-1.5 rounded-full border border-primary/10">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Built for Oil &amp; Lubricant Distributors
            </div>

            <h1 className="font-bold text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.1] tracking-tight text-foreground">
              Distribution, <span className="text-primary">Streamlined.</span>
            </h1>

            <p className="text-base lg:text-lg text-muted-foreground leading-relaxed max-w-lg">
              The all-in-one platform that helps oil &amp; lubricant
              distributors manage orders, inventory, invoicing, and sales — from
              booking to delivery.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg h-11 px-7 text-sm transition-colors"
              >
                Register Company
                <ArrowForwardIcon sx={{ fontSize: 16 }} />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center border border-primary text-primary hover:bg-primary/5 font-medium rounded-lg h-11 px-7 text-sm transition-colors"
              >
                Login
              </Link>
            </div>
          </div>

          {/* Right — Dashboard Mockup */}
          <div className="lg:pl-4">
            <OrderPipelineCard />
          </div>
        </div>
      </div>
    </section>
  );
}
