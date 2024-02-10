import Link from 'next/link';
import { Card } from './Card';
import { Button } from '@/components/ui/button';
import { PlusIcon } from '@radix-ui/react-icons';

const clients = [
  {
    name: 'Mohammad Karim',
    role: 'Technician',
    image: 'https://via.placeholder.com/80x80',
    email: 'm_karim@mail.com',
    phone: '0123456789'
  },
  {
    name: 'Mohammad Karim',
    role: 'Technician',
    image: 'https://via.placeholder.com/80x80',
    email: 'm_karim@mail.com',
    phone: '0123456789'
  },
  {
    name: 'Mohammad Karim',
    role: 'Technician',
    image: 'https://via.placeholder.com/80x80',
    email: 'm_karim@mail.com',
    phone: '0123456789'
  },
  {
    name: 'Mohammad Karim',
    role: 'Technician',
    image: 'https://via.placeholder.com/80x80',
    email: 'm_karim@mail.com',
    phone: '0123456789'
  },
  {
    name: 'Mohammad Karim',
    role: 'Technician',
    image: 'https://via.placeholder.com/80x80',
    email: 'm_karim@mail.com',
    phone: '0123456789'
  },
  {
    name: 'Mohammad Karim',
    role: 'Technician',
    image: 'https://via.placeholder.com/80x80',
    email: 'm_karim@mail.com',
    phone: '0123456789'
  }
];

export default function MyTeam() {
  return (
    <div>
      <div className="h-16 items-start justify-start py-3">
        <Link href={'/my-team/new'}>
          <Button>
            <PlusIcon className="mr-1" />
            New Client
          </Button>
        </Link>
      </div>
      <div className="flex flex-wrap items-start gap-6 self-stretch">
        {clients.map((client) => (
          <Card key={client.name} {...client} />
        ))}
      </div>
    </div>
  );
}
