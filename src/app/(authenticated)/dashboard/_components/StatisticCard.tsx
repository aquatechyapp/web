import { CiMoneyBill } from 'react-icons/ci';
import { FaCartArrowDown } from 'react-icons/fa';
import { IoMdPersonAdd } from 'react-icons/io';
import { TfiMoney } from 'react-icons/tfi';
import { RiMoneyDollarCircleFill } from 'react-icons/ri';

const types = {
  incomeCompany: {
    title: 'Income',
    subtitle: ' (as a company)',
    color: 'from-blue-600 to-sky-400',
    colorIcon: '#2770ED',
    prefix: '$',
    Icon: RiMoneyDollarCircleFill
  },
  incomeSubcontractor: {
    title: 'Income',
    subtitle: ' (as a sub-contractor)',
    color: 'from-teal-400 to-yellow-400',
    colorIcon: '#45CB99',
    prefix: '$',
    Icon: FaCartArrowDown
  },
  profit: {
    title: 'Profit',
    color: 'from-red-500 to-orange-300',
    colorIcon: '#F1574C',
    prefix: '$',
    Icon: TfiMoney
  },
  clients: {
    title: 'Clients',
    color: 'from-purple-700 to-blue-600',
    colorIcon: '#7826CF',
    prefix: '',
    Icon: IoMdPersonAdd
  }
};

type StatisticCardType =
  | 'incomeCompany'
  | 'incomeSubcontractor'
  | 'profit'
  | 'clients';

type Props = {
  type: StatisticCardType;
  value?: number;
};

export default function StatisticCard({ type, value }: Props) {
  const Icon = types[type].Icon;
  const displayValue = type.startsWith('income') ? value / 100 : value;

  return (
    <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-4 rounded-lg border border-zinc-200 bg-white p-5">
      <div className="flex flex-col items-start justify-start gap-2 self-stretch">
        <div className="inline-flex items-start justify-start gap-1 self-stretch">
          <div className="flex h-6 w-6 items-center justify-center gap-2">
            <Icon color={types[type].colorIcon} size={25} />
          </div>
          <div
            className="shrink grow basis-0 text-base font-medium leading-normal
          tracking-tight text-zinc-600"
          >
            {types[type].title}
            <span className="text-xs">{types[type]?.subtitle || ''}</span>
          </div>
        </div>
        <div className="self-stretch text-[32px] font-medium tracking-tight text-neutral-800">
          {types[type].prefix}
          {displayValue}
        </div>
        <div className="flex h-2 flex-col items-start justify-start gap-1 self-stretch">
          <div className="flex h-2 flex-col items-start justify-start gap-2 self-stretch rounded-[100px] bg-gray-100 pr-28">
            <div
              className={`h-2 w-[90%] rounded-[100px] bg-gradient-to-r ${types[type].color}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
