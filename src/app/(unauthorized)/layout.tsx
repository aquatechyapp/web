import SwimmingPool from '@/assets/images/swimming-pool.png';
import Image from 'next/image';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen">
      <div className="fixed left-0 top-0 -z-50 h-screen w-screen">
        <Image
          className="h-screen w-screen object-cover"
          src={SwimmingPool}
          alt="A big pool in background"
          quality="100"
        />
      </div>
      <div className="h flex h-[100%] max-h-[100vh] items-center justify-center">
        {children}
      </div>
    </div>
  );
}
