import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/src/components/ui/ui/accordion';

type Props = {
  Icon: React.ElementType;
  text: any;
  href: any;
  submenu: any;
};

export default function SideMenuNavLink({ Icon, text, href, submenu }: Props) {
  let pathname = usePathname();
  pathname = pathname.split('/')[1];

  const isActive = href === '/' + pathname;

  return (
    <Link
      href={href}
      // style={{ borderWidth: 1 }}
      className={`flex w-full p-2 items-start justify-start  ${isActive && 'border-r-4 border-blue-500 bg-gray-800 '}`}
    >
      <div className="flex items-center w-full"
      >

        {!submenu ?
          <>
            <div className="mr-4" >
              <Icon
                className={`opacity-90 ${isActive ? 'text-blue-500' : 'text-gray-300'}`}
                height={24}
                width={24}
              />
            </div>
            <div className="w-full py-4 text-base font-medium leading-none text-slate-50" >
              {text}
            </div>
          </>

          : <>

            <Accordion type="single" collapsible className="w-[100%]">
              <AccordionItem value="item-1" style={{ borderBottom: 'none'}} >
                <AccordionTrigger style={{ textDecoration: 'none'}} 
                className="w-full  text-base font-medium leading-none text-slate-50">
                  <div className="flex justify-start items-start w-full">
                    <Icon
                      className={`opacity-90 ${isActive ? 'text-blue-500' : 'text-gray-300'} mr-4`}
                      height={24}
                      width={24}
                    />
                  {text}
                  </div>
                </AccordionTrigger>
                {Object.entries(submenu).map(([key, subItem]) => (
                  <Link key={key} href={subItem.href}>
                    <AccordionContent className="text-ls font-medium leading-none text-gray-500">
                      {subItem.text}
                    </AccordionContent>
                  </Link>
                ))}
              </AccordionItem>
            </Accordion>
          </>
        }
      </div>

    </Link>

  );
}
