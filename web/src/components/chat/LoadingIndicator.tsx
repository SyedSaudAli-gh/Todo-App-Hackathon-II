/**
 * LoadingIndicator.tsx – 100% stock Tailwind animations only
 */
interface LoadingIndicatorProps {
  status?: string;
}

export function LoadingIndicator({ status }: LoadingIndicatorProps = {}) {
  const text = status || "Thinking";

  return (
    <div className="flex justify-start px-4 py-5 sm:px-6">
      <div
        className={`
          relative flex items-center gap-3.5
          max-w-[84%] sm:max-w-[78%] md:max-w-[70%]
          rounded-2xl px-5 py-3.5
          bg-white/80 backdrop-blur-lg
          border border-gray-200/50
          shadow-xl
          transition-all duration-300
          animate-fade-in
        `}
      >
        {/* Pulsing dots – using built-in pulse */}
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-indigo-500 animate-pulse" />
          <div className="h-3 w-3 rounded-full bg-indigo-600 animate-pulse [animation-delay:200ms]" />
          <div className="h-3 w-3 rounded-full bg-indigo-700 animate-pulse [animation-delay:400ms]" />
        </div>

        {/* Text + classic bouncing ellipsis */}
        <div className="flex items-baseline text-[15px] font-medium text-gray-800 tracking-tight">
          <span>{text}</span>
          <span className="ml-1.5 inline-flex w-8 text-indigo-400 font-bold">
            <span className="inline-block animate-bounce [animation-delay:-0.3s]">.</span>
            <span className="inline-block animate-bounce [animation-delay:-0.15s]">.</span>
            <span className="inline-block animate-bounce">.</span>
          </span>
        </div>

        {/* Subtle glow */}
        <div className="absolute -bottom-1 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent blur-sm opacity-70 pointer-events-none" />
      </div>
    </div>
  );
}