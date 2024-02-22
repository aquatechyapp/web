export default function FilterBar() {
  return (
    <div className="ControlsBar inline-flex h-10 items-start justify-start gap-3 rounded-lg bg-white shadow-inner">
      <div className="ButtonMedium flex items-center justify-start gap-3 rounded-lg border border-gray-200 bg-white py-3 pl-5 pr-3">
        <div className="NewEntry font-['General Sans'] text-sm font-medium leading-[14px] text-neutral-900">
          Filter clients
        </div>
        <div className="FilterList relative h-4 w-4" />
      </div>
      <div className="SearchInput flex h-10 shrink grow basis-0 items-center justify-start gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3">
        <div className="TryMiamiBeachhouse font-['General Sans'] text-sm font-medium leading-[14px] text-gray-300">
          Try ‘John Doe’
        </div>
        <div className="Search relative h-4 w-4" />
      </div>
      <div className="Tabs flex items-start justify-start rounded-lg border border-zinc-200 bg-white p-1">
        <div className="Tab flex items-center justify-center gap-2 rounded-md bg-gray-100 px-3 py-1.5">
          <div className="Text font-['Public Sans'] text-sm font-semibold leading-tight tracking-tight text-neutral-800">
            All clients
          </div>
        </div>
        <div className="Tab flex items-center justify-center gap-2 rounded-lg px-3 py-1.5">
          <div className="Text font-['Public Sans'] text-sm font-medium leading-tight tracking-tight text-gray-500">
            Active
          </div>
        </div>
        <div className="Tab flex items-center justify-center gap-2 rounded-lg px-3 py-1.5">
          <div className="Text font-['Public Sans'] text-sm font-medium leading-tight tracking-tight text-gray-500">
            Inactive
          </div>
        </div>
      </div>
      <div className="ButtonMedium flex items-center justify-start gap-3 rounded-[32px] border border-gray-200 bg-white p-3">
        <div className="MoreVert relative h-4 w-4" />
      </div>
    </div>
  );
}
