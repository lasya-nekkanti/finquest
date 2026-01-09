type BossNodeProps = {
  href: string;
  locked?: boolean;
  showTooltip?: boolean;
};

export default function BossNode({
  href,
  locked = false,
  showTooltip = false,
}: BossNodeProps) {
  const content = (
    <div className="relative group">
      <div
        className={`
          w-24 h-24 rounded-full
          flex items-center justify-center
          text-4xl
          my-4
          transition-transform duration-150
          ${
            locked
              ? "bg-gray-700 text-gray-400 opacity-60 cursor-not-allowed"
              : "bg-gradient-to-br from-red-500 to-red-700 shadow-[0_8px_0_#7f1d1d] animate-bounce"
          }
        `}
      >
        {locked ? "🔒" : "👹"}
      </div>
      {locked && showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 border border-gray-700">
          Complete all levels to unlock.
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
            <div className="w-2 h-2 bg-gray-800 border-r border-b border-gray-700 transform rotate-45"></div>
          </div>
        </div>
      )}
    </div>
  );

  if (locked) return content;

  return <a href={href}>{content}</a>;
}
