'use client';

import Map from './Map';
import { RoutesList } from './RoutesList';

export default function Routes() {
  return (
    <div className="inline-flex h-[100%] w-[100%] items-start justify-start gap-3 bg-white p-2.5 shadow-inner">
      <div className="w-[50%]">
        <RoutesList />
      </div>
      <div className="w-[50%]">
        <Map />
      </div>
    </div>
  );
}
