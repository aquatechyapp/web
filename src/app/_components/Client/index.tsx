import ActionButtons from './ActionButtons';
import ClientsList from './ClientsList';
import FilterBar from './FilterBar';

export default function Client() {
  return (
    <div className="flex flex-col gap-6">
      <ActionButtons />
      <FilterBar />
      <ClientsList />
    </div>
  );
}
