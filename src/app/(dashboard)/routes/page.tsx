import { RoutesList } from './_components/RoutesList';
import Map from './_components/Map';

export default function Page() {
  return (
    <div className="inline-flex h-[100%] w-full items-start justify-start gap-3 bg-white p-2.5 shadow-inner">
      <div className="w-[50%]">
        <RoutesList />
      </div>
      <div className="w-[50%]">
        <Map />
      </div>
    </div>
  );
}
