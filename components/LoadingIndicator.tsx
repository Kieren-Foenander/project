export function LoadingIndicator() {
  return (
    <div className="flex items-center space-x-2 animate-pulse">
      <div className="w-2 h-2 bg-current rounded-full"></div>
      <div className="w-2 h-2 bg-current rounded-full animation-delay-150"></div>
      <div className="w-2 h-2 bg-current rounded-full animation-delay-300"></div>
    </div>
  );
}