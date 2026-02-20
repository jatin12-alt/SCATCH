export default function ProductSkeleton() {
  return (
    <div className="bg-white rounded-[2rem] overflow-hidden border border-stone-50 animate-pulse">
      <div className="aspect-[4/5] bg-stone-100"></div>
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2 flex-1">
            <div className="h-2 bg-stone-100 rounded-full w-1/4"></div>
            <div className="h-4 bg-stone-100 rounded-full w-3/4"></div>
          </div>
          <div className="h-6 bg-stone-100 rounded-lg w-16"></div>
        </div>
      </div>
    </div>
  );
}
