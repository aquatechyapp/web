import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

type Props = {
  Icon: React.ElementType;
  text: string;
  href: string;
  submenu?: {
    [key: string]: {
      text: string;
      href: string;
      isActive: boolean;
    };
  };
  isActive: boolean;
  setOpen?: (open: boolean) => void;
};

export default function SideMenuNavLink({ Icon, text, href, submenu, setOpen }: Props) {
  let pathname = usePathname();
  pathname = pathname.split('/')[1];

  const isActive = href === '/' + pathname;

  const isActiveSubMenu = submenu ? Object.values(submenu).some((item) => item.href === '/' + pathname) : false;

  const handleClick = (href: string) => {
    // fechar menu mobile lateral
    if (setOpen) {
      setOpen(false);
    }
    window.location.href = href;
  };

  return (
    <Link
      href={href}
      passHref
      className={`flex w-full items-start justify-start px-2 text-gray-300 hover:bg-gray-800
      ${isActive && 'border-r-4 border-blue-500 bg-gray-800 '} `}
    >
      <div className="flex w-full items-center">
        {!submenu ? (
          <div className="flex w-full items-center" onClick={() => setOpen && setOpen(false)}>
            <div className="mr-4 py-4">
              <Icon height={24} width={24} size={22} className={`${isActive && 'text-blue-500'}`} />
            </div>
            <div className="w-full text-base font-medium leading-none text-slate-50">{text}</div>
          </div>
        ) : (
          <Accordion collapsible type="single" className="w-[100%]">
            <AccordionItem value="item-1" style={{ borderBottom: 'none' }}>
              <AccordionTrigger
                style={{ textDecoration: 'none' }}
                className={`w-full  text-base font-medium leading-none text-slate-50
                ${isActiveSubMenu && 'text-blue-500'}`}
              >
                <div className="flex w-[25%] items-start justify-start">
                  <Icon height={24} width={24} className={`mr-4`} />
                </div>
                <div className="flex w-[100%] items-start justify-start text-slate-50">{text}</div>
              </AccordionTrigger>
              {Object.entries(submenu).map(([key, subItem]) => (
                <span key={key} onClick={() => handleClick(subItem.href)}>
                  <AccordionContent className="text-ls font-medium leading-none text-gray-500 hover:font-semibold hover:text-gray-400">
                    <div className="ml-10 flex w-[50%] items-start justify-start">{subItem.text}</div>
                  </AccordionContent>
                </span>
              ))}
            </AccordionItem>
          </Accordion>
        )}
      </div>
    </Link>
  );
}
