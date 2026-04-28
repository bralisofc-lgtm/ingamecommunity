const SectionDivider = () => (
  <div className="relative py-2" aria-hidden="true">
    <div className="container mx-auto px-4">
      <div className="flex items-center gap-4 opacity-70">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
        <svg width="22" height="22" viewBox="0 0 32 32" className="animate-ghost-bob text-primary-glow">
          <path
            d="M16 4 C9 4 5 9 5 16 L5 27 L8 24 L11 27 L14 24 L17 27 L20 24 L23 27 L26 24 L26 16 C26 9 22 4 16 4 Z"
            fill="currentColor"
          />
          <circle cx="12" cy="14" r="1.6" fill="hsl(var(--background))" />
          <circle cx="20" cy="14" r="1.6" fill="hsl(var(--background))" />
        </svg>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      </div>
    </div>
  </div>
);

export default SectionDivider;
