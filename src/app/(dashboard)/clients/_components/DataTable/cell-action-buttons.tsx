'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { FaRegTrashAlt } from 'react-icons/fa';
import { IoEyeOutline } from 'react-icons/io5';

export default function ActionButtons({ ...props }) {
  console.log(props);
  const { push } = useRouter();
  const handleView = () => {
    push('/clients/1');
  };
  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="icon">
        <IoEyeOutline onClick={() => handleView()} />
      </Button>
      <Button variant="destructive" size="sm">
        <FaRegTrashAlt />
      </Button>
    </div>
  );
}
