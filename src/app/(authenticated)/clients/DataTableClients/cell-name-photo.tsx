import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function NamePhoto({ cell }) {
  const { pools, name, email1 } = cell.row.original;
  return (
    <div className="flex">
      <Avatar>
        <AvatarImage src={pools[pools.length - 1]?.photos[0] || 'https://via.placeholder.com/30x30'} />
        <AvatarFallback />
      </Avatar>
      <div className="ml-4 flex flex-col">
        <span>{name}</span>
        <span>{email1}</span>
      </div>
    </div>
  );
}
