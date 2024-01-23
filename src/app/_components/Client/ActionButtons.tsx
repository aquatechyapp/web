export default function ActionButtons() {
  return (
    <div className="inline-flex h-16 items-start justify-start gap-4 bg-white px-[18px] py-3 shadow-inner">
      <div className="flex items-center justify-start gap-2 rounded-lg bg-indigo-600 py-3 pl-5 pr-3">
        <div className="text-sm font-medium leading-[14px] text-white">
          Add customer
        </div>
      </div>
      <div className="flex items-center justify-start gap-2 rounded-lg bg-zinc-100 py-3 pl-5 pr-3">
        <div className="font-['General Sans'] text-sm font-medium leading-[14px] text-neutral-900">
          Add pool to an existing customer
        </div>
        <div className="relative h-4 w-4" />
      </div>
    </div>
  );
}
