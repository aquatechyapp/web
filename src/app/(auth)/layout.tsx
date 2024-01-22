import SwimmingPool from '@/app/_assets/_images/swimming-pool.png';
import Image from 'next/image';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="fixed left-0 top-0 -z-50 h-screen w-screen">
        <Image
          src={SwimmingPool}
          alt="A big pool in background"
          quality="100"
        />
      </div>
      <div className="flex h-screen items-center justify-center">
        {children}
      </div>
    </>
  );
}
