import React, { useEffect } from 'react';

interface AdSenseBannerProps {
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  className?: string;
}

export const AdSenseBanner: React.FC<AdSenseBannerProps> = ({
  slot = '5315495804',
  format = 'auto',
  className = '',
}) => {
  useEffect(() => {
    try {
      // Push ad initialization to Google AdSense queue
      const win = window as unknown as { adsbygoogle: unknown[] };
      win.adsbygoogle = win.adsbygoogle || [];
      win.adsbygoogle.push({});
    } catch {
      // Fail silently if AdBlocker is active or awaiting Google review
    }
  }, []);

  return (
    <div className={`w-full overflow-hidden my-4 p-2.5 rounded-2xl bg-zinc-950/80 border border-zinc-900 flex flex-col items-center justify-center text-center transition hover:border-zinc-800 ${className}`}>
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#ff9f0a]/60"></span>
        <span className="text-[8px] uppercase tracking-widest text-zinc-500 font-mono">
          Sponsored • Google AdSense
        </span>
      </div>
      <div className="w-full flex justify-center min-h-[90px] sm:min-h-[100px] overflow-hidden">
        <ins
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
