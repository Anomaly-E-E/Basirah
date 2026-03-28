import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { CanvasRevealEffect } from "@/components/ui/CanvasRevealEffect";

/* ─── Floating Navbar ─── */

function SignInNavbar() {
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-full",
          "bg-white/5 backdrop-blur-xl border border-white/10"
        )}
      >
        {/* Logo */}
        <div className="grid grid-cols-2 gap-0.5 ml-1">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/80" />
          ))}
        </div>

        {/* Buttons */}
        <button className="px-4 py-1.5 text-sm text-white/80 hover:text-white transition-colors rounded-full border border-white/10">
          Login
        </button>
        <button className="px-4 py-1.5 text-sm text-white bg-white/15 rounded-full hover:bg-white/20 transition-colors">
          Signup
        </button>
      </div>
    </nav>
  );
}

/* ─── Step Components ─── */

const slideLeftVariants = {
  enter: { x: -80, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -80, opacity: 0 },
};

const slideRightVariants = {
  enter: { x: 80, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: 80, opacity: 0 },
};

const fadeUpVariants = {
  enter: { y: 40, opacity: 0 },
  center: { y: 0, opacity: 1 },
  exit: { y: 40, opacity: 0 },
};

const transition = { duration: 0.4, ease: "easeOut" };

function EmailStep({ onSubmit }: { onSubmit: (email: string) => void }) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) onSubmit(email);
  };

  return (
    <motion.div
      key="email"
      variants={slideLeftVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={transition}
      className="w-full max-w-lg mx-auto"
    >
      <h1 className="text-5xl md:text-6xl font-bold text-white mb-3 text-center">
        Welcome Developer
      </h1>
      <p className="text-lg text-white/40 mb-10 text-center">
        Your sign in component
      </p>

      <button
        className={cn(
          "w-full py-4 px-6 rounded-full text-base text-white/90",
          "bg-white/5 backdrop-blur-xl border border-white/10",
          "hover:bg-white/10 transition-colors flex items-center justify-center gap-3"
        )}
      >
        <span className="text-lg font-semibold">G</span>
        Sign in with Google
      </button>

      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-sm text-white/30">or</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@gmail.com"
            className={cn(
              "w-full py-4 px-6 pr-14 rounded-full text-base text-white text-center",
              "bg-white/5 border border-white/10 placeholder:text-white/25",
              "focus:outline-none focus:border-white/25 transition-colors"
            )}
          />
          <button
            type="submit"
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2",
              "w-10 h-10 rounded-full flex items-center justify-center",
              "bg-white/10 hover:bg-white/20 transition-colors text-white"
            )}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5-5 5M6 12h12" />
            </svg>
          </button>
        </div>
      </form>

      <p className="text-xs text-white/25 mt-8 text-center leading-relaxed">
        By signing up, you agree to the{" "}
        <a href="#" className="underline hover:text-white/40">MSA</a>,{" "}
        <a href="#" className="underline hover:text-white/40">Product Terms</a>,{" "}
        <a href="#" className="underline hover:text-white/40">Policies</a>,{" "}
        <a href="#" className="underline hover:text-white/40">Privacy Notice</a>, and{" "}
        <a href="#" className="underline hover:text-white/40">Cookie Notice</a>.
      </p>
    </motion.div>
  );
}

function CodeStep({
  onBack,
  onComplete,
}: {
  onBack: () => void;
  onComplete: () => void;
}) {
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const completed = code.every((c) => c !== "");

  const handleChange = useCallback(
    (index: number, value: string) => {
      if (!/^\d?$/.test(value)) return;
      const next = [...code];
      next[index] = value;
      setCode(next);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }

      if (next.every((c) => c !== "")) {
        onComplete();
      }
    },
    [code, onComplete]
  );

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <motion.div
      key="code"
      variants={slideRightVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={transition}
      className="w-full max-w-lg mx-auto"
    >
      <h1 className="text-5xl md:text-6xl font-bold text-white mb-3 text-center">
        We sent you a code
      </h1>
      <p className="text-lg text-white/40 mb-10 text-center">Please enter it</p>

      <div
        className={cn(
          "flex items-center rounded-full overflow-hidden",
          "bg-white/5 border border-white/10"
        )}
      >
        {code.map((digit, i) => (
          <div key={i} className="flex items-center flex-1">
            <input
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={cn(
                "w-full py-4 text-center text-xl text-white bg-transparent",
                "focus:outline-none"
              )}
            />
            {i < 5 && <div className="w-px h-7 bg-white/10 shrink-0" />}
          </div>
        ))}
      </div>

      <button className="text-sm text-white/40 hover:text-white/60 transition-colors mt-5 block mx-auto">
        Resend code
      </button>

      <div className="flex gap-3 mt-8">
        <button
          onClick={onBack}
          className="w-[30%] py-3.5 rounded-full text-sm font-medium bg-white text-black hover:bg-white/90 transition-colors"
        >
          Back
        </button>
        <button
          disabled={!completed}
          className={cn(
            "w-[70%] py-3.5 rounded-full text-sm font-medium transition-colors",
            completed
              ? "bg-white text-black hover:bg-white/90"
              : "bg-white/10 text-white/30 cursor-not-allowed"
          )}
        >
          Continue
        </button>
      </div>
    </motion.div>
  );
}

function SuccessStep({ onContinue }: { onContinue: () => void }) {
  return (
    <motion.div
      key="success"
      variants={fadeUpVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={transition}
      className="w-full max-w-lg mx-auto text-center"
    >
      <h1 className="text-5xl md:text-6xl font-bold text-white mb-3">You're in!</h1>
      <p className="text-lg text-white/40 mb-10">Welcome</p>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
        className="w-20 h-20 mx-auto mb-10 rounded-full bg-white flex items-center justify-center"
      >
        <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </motion.div>

      <button
        onClick={onContinue}
        className="w-full py-3.5 rounded-full text-sm font-medium bg-white text-black hover:bg-white/90 transition-colors"
      >
        Continue to Dashboard
      </button>
    </motion.div>
  );
}

/* ─── Side Arrow ─── */

function SideArrow({ direction }: { direction: "left" | "right" }) {
  return (
    <div
      className={cn(
        "hidden md:flex items-center justify-center",
        "fixed top-1/2 -translate-y-1/2 z-20",
        direction === "left" ? "left-6" : "right-6"
      )}
    >
      <button className="w-10 h-10 flex items-center justify-center text-white/20 hover:text-white/50 transition-colors">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          {direction === "left" ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          )}
        </svg>
      </button>
    </div>
  );
}

/* ─── Main SignInPage ─── */

interface SignInPageProps {
  onSuccess: () => void;
}

export default function SignInPage({ onSuccess }: SignInPageProps) {
  const [step, setStep] = useState<"email" | "code" | "success">("email");
  const [reverseAnim, setReverseAnim] = useState(false);

  const handleEmailSubmit = useCallback(() => {
    setStep("code");
  }, []);

  const handleCodeComplete = useCallback(() => {
    setReverseAnim(true);
    setTimeout(() => {
      setStep("success");
    }, 2000);
  }, []);

  const handleBack = useCallback(() => {
    setStep("email");
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden">
      <CanvasRevealEffect reverse={reverseAnim} />
      <SignInNavbar />
      <SideArrow direction="left" />
      <SideArrow direction="right" />

      <div className="relative z-10 flex items-center justify-center h-full px-6">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait">
            {step === "email" && (
              <EmailStep onSubmit={handleEmailSubmit} />
            )}
            {step === "code" && (
              <CodeStep onBack={handleBack} onComplete={handleCodeComplete} />
            )}
            {step === "success" && (
              <SuccessStep onContinue={onSuccess} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
