export function HeroVisual() {
  return (
    <div className="animate-hero-visual hero-float relative mx-auto aspect-square w-full max-w-md">
      <div className="hero-ring absolute inset-[12%] rounded-full border border-white/10 bg-gradient-to-br from-blush/20 via-transparent to-violet/25" />
      <div className="absolute inset-[22%] rounded-full border border-white/10 bg-black/30 backdrop-blur-sm" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative h-40 w-40">
          <span className="hero-orb hero-orb-a absolute left-1/2 top-1/2 -ml-[9px] -mt-[9px]" />
          <span className="hero-orb hero-orb-b absolute left-1/2 top-1/2 -ml-[7px] -mt-[7px]" />
          <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_24px_rgba(255,255,255,0.8)]" />
        </div>
      </div>
      <p className="absolute bottom-6 left-0 right-0 text-center text-xs uppercase tracking-[0.28em] text-white/50">
        Agents orbit · then match
      </p>
    </div>
  );
}
