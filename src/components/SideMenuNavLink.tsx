import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

type Props = {
  Icon: React.ElementType;
  text: string;
  href: string;
  submenu?: {
    [key: string]:{
      text: string;
      href: string;
    }
  }
};

export default function SideMenuNavLink({ Icon, text, href, submenu }: Props) {
  let pathname = usePathname();
  pathname = pathname.split('/')[1];

  const isActive = href === '/' + pathname;

  const handleClick = (href: any) => {
    window.location.href = href;
  };

  return (
    <Link
      href={href}
      passHref
      className={`flex w-full px-2 items-start justify-start hover:bg-gray-800 text-gray-300 hover:text-blue-500
      ${isActive && 'border-r-4 border-blue-500 bg-gray-800 '} `}
    >
      <div className="flex items-center w-full"
      >
        {!submenu ?
          <>
            <div className="mr-4 py-4" >
              <Icon
                height={24}
                width={24}
              />
            </div>
            <div className="w-full text-base font-medium leading-none text-slate-50" >
              {text}
            </div>
          </>
          :
          <Accordion collapsible type="single" className="w-[100%] ">
            <AccordionItem value="item-1" style={{ borderBottom: 'none' }}>
              <AccordionTrigger style={{ textDecoration: 'none' }}
                className="w-full  text-base font-medium leading-none text-slate-50 text-gray-300 hover:text-blue-500">
                <div className="flex justify-start items-start w-[20%]">
                  <Icon
                    className={`mr-4`}
                    height={24}
                    width={24}
                  />
                </div>
                <div className="flex justify-start items-start w-full text-slate-50">
                  {text}
                </div>
              </AccordionTrigger>
              {Object.entries(submenu).map(([key, subItem]) => (
                <span key={key} onClick={() => handleClick(subItem.href)}>
                  <AccordionContent className="text-ls font-medium leading-none text-gray-500">
                    <div className="flex justify-start items-start w-[50%] ml-10">
                      {subItem.text}
                    </div>
                  </AccordionContent>
                </span>
              ))}
            </AccordionItem>
          </Accordion>
        }
      </div>

    </Link>

  );
}
