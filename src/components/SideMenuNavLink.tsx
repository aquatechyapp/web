import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/src/components/ui/ui/accordion';

type Props = {
  Icon: React.ElementType;
  text: string;
  href: string;
};

export default function SideMenuNavLink({ Icon, text, href }: Props) {
  let pathname = usePathname();
  pathname = pathname.split('/')[1];

  const isActive = href === '/' + pathname;
  return (
    <Link
      href={href !== '/clients' ? href : ''}
      className={`flex w-full p-2 items-center justify-center   ${isActive && 'border-r-4 border-blue-500 bg-gray-800 '}`}
    >
      <div className="flex w-[80%] items-center ">
        <div className="mr-4">
          <Icon
            className={`opacity-90 ${isActive ? 'text-blue-500' : 'text-gray-300'}`}
            height={24}
            width={24}
          />
        </div>
        {text !== 'Clients' ? <div className="w-full  text-base font-medium leading-none text-slate-50">
          {text}
        </div>
          :
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="w-full  text-base font-medium leading-none text-slate-50">
                Clients
              </AccordionTrigger>
              <Link  href={href}>
              <AccordionContent className="w-full text-ls font-medium leading-none text-gray-500">
                Clients
              </AccordionContent>
              </Link>
              <AccordionContent className="w-full text-ls font-medium leading-none text-gray-500">
               Add client
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        }
      </div>
    </Link>

  );
}
