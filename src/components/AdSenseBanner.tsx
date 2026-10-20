import React, { useEffect, useRef } from 'react';

interface AdSenseBannerProps {
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  label?: string;
  className?: string;
}

export const AdSenseBanner: React.FC<AdSenseBannerProps> = ({
  slot = '5315495804',
  format = 'auto',
  label = 'Sponsored • Google AdSense',
  className = '',
}) => {
  const adRef = useRef<HTMLModElement | null>(null);
  const isPushed = useRef<boolean>(false);

  useEffect(() => {
    // Only push once per mounted component instance
    if (!isPushed.current && adRef.current) {
      try {
        const win = window as unknown as { adsbygoogle: unknown[] };
        win.adsbygoogle = win.adsbygoogle || [];
        win.adsbygoogle.push({});
        isPushed.current = true;
      } catch {
        // Fail gracefully if blocked by client or in testing
      }
    }
  }, []);

  return (
    <div className={`w-full overflow-hidden my-4 p-2 rounded-2xl bg-zinc-950/70 border border-zinc-900/90 flex flex-col items-center justify-center text-center transition-all hover:border-zinc-800 ${className}`}>
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#ff9f0a]/70 animate-pulse"></span>
        <span className="text-[8px] uppercase tracking-widest text-zinc-500 font-mono">
          {label}
        </span>
      </div>
      <div className="w-full flex justify-center items-center min-h-[90px] sm:min-h-[100px] overflow-hidden">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', minHeight: '90px' }}
          data-ad-client="ca-pub-5315495804257937"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
};
