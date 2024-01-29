import SideMenuNav from '../_components/SideMenuNav';
import TopBarMenu from '../_components/TopBarMenu';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex grid h-screen w-screen grid-cols-6">
      <SideMenuNav />
      <div className="col-span-5 bg-[#FAFAFA]">
        <TopBarMenu />
        <main className="px-7">{children}</main>
      </div>
    </div>
  );
}
