export function LoadingSpinner() {
  return (
    <div className="fixed left-0 top-0 z-50 h-full w-full bg-gray-50 opacity-75">
      <div className="mt-[50vh] flex items-center justify-center">
        <div className="h-20 w-20 animate-spin rounded-full border-8 border-gray-300 border-t-blue-500" />
      </div>
    </div>
  );
}
