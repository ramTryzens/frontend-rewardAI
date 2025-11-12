import { SignUp } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { useRef, useEffect } from "react";

const SignUpPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    // Trigger animations on mount
    const timer = setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.style.opacity = '1';
        containerRef.current.style.transform = 'translateY(0)';
      }
      if (logoRef.current) {
        logoRef.current.style.transform = 'scale(1)';
      }
      if (titleRef.current) {
        titleRef.current.style.opacity = '1';
        titleRef.current.style.transform = 'translateY(0)';
      }
      if (subtitleRef.current) {
        subtitleRef.current.style.opacity = '1';
      }
      if (lineRef.current) {
        lineRef.current.style.transform = 'scaleX(1)';
      }
      if (footerRef.current) {
        footerRef.current.style.opacity = '1';
      }
    }, 50);

    // Remove transitions after animations complete to prevent retriggering
    const cleanupTimer = setTimeout(() => {
      if (containerRef.current) containerRef.current.style.transition = 'none';
      if (logoRef.current) logoRef.current.style.transition = 'none';
      if (titleRef.current) titleRef.current.style.transition = 'none';
      if (subtitleRef.current) subtitleRef.current.style.transition = 'none';
      if (lineRef.current) lineRef.current.style.transition = 'none';
      if (footerRef.current) footerRef.current.style.transition = 'none';
    }, 1500);

    return () => {
      clearTimeout(timer);
      clearTimeout(cleanupTimer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px]" />

        {/* Floating Orbs */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 27,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Main Content */}
      <div
        ref={containerRef}
        className="w-full max-w-md relative z-10"
        style={{
          opacity: 0,
          transform: 'translateY(20px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease'
        }}
      >
        {/* Header Section */}
        <div className="text-center mb-10">
          {/* Logo/Icon Area */}
          <div
            ref={logoRef}
            className="inline-flex items-center justify-center w-20 h-20 mb-6 relative"
            style={{
              transform: 'scale(0)',
              transition: 'transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.2s'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-purple-600 rounded-2xl blur-xl opacity-60 animate-pulse" />
            <div className="relative bg-gradient-to-br from-primary to-purple-600 rounded-2xl p-4 shadow-2xl">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </div>
          </div>

          <h1
            ref={titleRef}
            className="text-5xl font-bold text-foreground mb-3 tracking-tight"
            style={{
              opacity: 0,
              transform: 'translateY(-20px)',
              transition: 'opacity 0.5s ease 0.3s, transform 0.5s ease 0.3s'
            }}
          >
            Create Account
          </h1>
          <p
            ref={subtitleRef}
            className="text-muted-foreground text-lg"
            style={{
              opacity: 0,
              transition: 'opacity 0.5s ease 0.4s'
            }}
          >
            Register to get started with AI-powered offers
          </p>

          {/* Decorative Line */}
          <div
            ref={lineRef}
            className="mx-auto mt-4 h-1 w-24 bg-gradient-to-r from-primary via-purple-500 to-primary rounded-full"
            style={{
              transform: 'scaleX(0)',
              transition: 'transform 0.6s ease 0.5s'
            }}
          />
        </div>

        {/* Auth Card with Enhanced Glassmorphism */}
        <div className="relative group">
          {/* Animated Border Gradient */}
          <div className="absolute -inset-[1px] bg-gradient-to-r from-primary via-purple-500 to-primary rounded-3xl opacity-75 blur-sm group-hover:opacity-100 transition-opacity duration-500 animate-gradient-xy" />

          {/* Inner Card Container */}
          <div className="relative bg-background/40 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            {/* Shimmer Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>

            {/* Clerk Component */}
            <div className="relative p-1">
              <SignUp
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "bg-transparent border-0 shadow-none",
                    headerTitle: "text-2xl font-bold text-white",
                    headerSubtitle: "text-muted-foreground",
                    formButtonPrimary: "bg-gradient-to-r from-primary to-purple-600 hover:shadow-lg hover:shadow-primary/50 transition-all duration-300",
                    footerActionLink: "text-primary hover:text-purple-500 transition-colors",
                    formFieldInput: "bg-white/5 border-white/10 focus:border-primary/50 transition-colors backdrop-blur-sm",
                    formFieldLabel: "text-foreground/90",
                    dividerLine: "bg-white/10",
                    dividerText: "text-muted-foreground",
                    socialButtonsBlockButton: "bg-white/5 border-white/10 hover:bg-white/10 hover:border-primary/30 transition-all",
                    socialButtonsBlockButtonText: "text-foreground",
                  },
                }}
                routing="virtual"
                signInUrl="/sign-in"
                redirectUrl="/dashboard"
              />
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <p
          ref={footerRef}
          className="text-center mt-8 text-sm text-muted-foreground"
          style={{
            opacity: 0,
            transition: 'opacity 0.5s ease 0.7s'
          }}
        >
          Join thousands of merchants using AI-powered solutions
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
