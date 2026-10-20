import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export const StickyBottomAd: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const adRef = useRef<HTMLModElement | null>(null);
  const isPushed = useRef<boolean>(false);

  useEffect(() => {
    if (!isPushed.current && adRef.current) {
      try {
        const win = window as unknown as { adsbygoogle: unknown[] };
        win.adsbygoogle = win.adsbygoogle || [];
        win.adsbygoogle.push({});
        isPushed.current = true;
      } catch {
        // Fail gracefully
      }
    }
  }, []);

  if (!isVisible) return null;

  return (
    <aside 
      aria-label="Advertisement"
      className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 border-t border-zinc-800/90 backdrop-blur-md shadow-2xl transition-all animate-in slide-in-from-bottom duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between py-1.5 gap-3">
        <div className="flex items-center gap-1.5 shrink-0 hidden sm:flex">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff9f0a]"></span>
          <span className="text-[8px] uppercase tracking-widest text-zinc-500 font-mono">
            Advertisement
          </span>
        </div>

        {/* Ad Container */}
        <div className="flex-1 flex justify-center items-center min-h-[50px] sm:min-h-[60px] overflow-hidden">
          <ins
            ref={adRef}
            className="adsbygoogle"
            style={{ display: 'inline-block', width: '100%', maxWidth: '728px', height: '60px' }}
            data-ad-client="ca-pub-5315495804257937"
            data-ad-slot="5315495804"
            data-ad-format="horizontal"
            data-full-width-responsive="true"
          />
        </div>

        {/* Close / Dismiss Button */}
        <button
          onClick={() => setIsVisible(false)}
          aria-label="Close advertisement"
          className="shrink-0 p-1.5 rounded-full text-zinc-500 hover:text-white hover:bg-zinc-900 transition"
          title="Dismiss ad"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
