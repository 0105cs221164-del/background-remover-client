// Full-page spinner — shown while AppContext restores session
const PageLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-[#0f0f0f] z-50">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-white/30 text-sm">Loading BgEraser...</p>
    </div>
  </div>
);

export default PageLoader;
