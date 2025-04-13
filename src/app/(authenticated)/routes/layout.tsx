
'use client';

import { AssignmentsProvider } from '@/context/assignments';

import { ServicesProvider } from '@/context/services';

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AssignmentsProvider>
      <ServicesProvider>
        {children}
      </ServicesProvider>
    </AssignmentsProvider>
  );
}
