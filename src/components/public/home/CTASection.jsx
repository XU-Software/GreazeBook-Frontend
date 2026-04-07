import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="bg-[#0D2137] py-20 lg:py-24 px-6">
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <h2 className="font-bold text-3xl md:text-4xl text-white tracking-tight">
          Ready to modernize your distribution?
        </h2>
        <p className="text-base text-blue-200/80 leading-relaxed max-w-lg mx-auto">
          Join hundreds of oil &amp; lubricant distributors who trust GreazeBook
          to run their operations — faster, cleaner, smarter.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/register-company"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg h-11 px-7 text-sm transition-colors"
          >
            Register Company
            <ArrowForwardIcon sx={{ fontSize: 16 }} />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center border border-white/30 text-white hover:bg-white/10 font-medium rounded-lg h-11 px-7 text-sm transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    </section>
  );
}
