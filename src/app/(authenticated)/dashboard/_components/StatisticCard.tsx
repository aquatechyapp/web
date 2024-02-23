import { CiMoneyBill } from 'react-icons/ci';
import { FaCartArrowDown } from 'react-icons/fa';
import { IoMdPersonAdd } from 'react-icons/io';
import { TfiMoney } from 'react-icons/tfi';

const types = {
  income: {
    title: 'Income',
    color: 'from-blue-600 to-sky-400',
    prefix: '$',
    Icon: CiMoneyBill
  },
  expenses: {
    title: 'Expenses',
    color: 'from-teal-400 to-yellow-400',
    prefix: '$',
    Icon: FaCartArrowDown
  },
  profit: {
    title: 'Profit',
    color: 'from-red-500 to-orange-300',
    prefix: '$',
    Icon: TfiMoney
  },
  clients: {
    title: 'Clients',
    color: 'from-purple-700 to-blue-600',
    prefix: '',
    Icon: IoMdPersonAdd
  }
};

type StatisticCardType = 'income' | 'expenses' | 'profit' | 'clients';

type Props = {
  type: StatisticCardType;
};

export default function StatisticCard({ type }: Props) {
  const Icon = types[type].Icon;
  return (
    <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-4 rounded-lg border border-zinc-200 bg-white p-5">
      <div className="flex h-[70px] flex-col items-start justify-start gap-2 self-stretch">
        <div className="inline-flex items-start justify-start gap-1 self-stretch">
          <div className="flex h-6 w-6 items-center justify-center gap-2">
            <Icon />
          </div>
          <div className="font-['Public Sans'] shrink grow basis-0 text-base font-medium leading-normal tracking-tight text-zinc-500">
            {types[type].title}
          </div>
        </div>
        <div className="font-['Public Sans'] self-stretch text-[32px] font-semibold tracking-tight text-neutral-800">
          {types[type].prefix}1,985
        </div>
      </div>
      <div className="flex h-2 flex-col items-start justify-start gap-1 self-stretch">
        {/* Componente Proggress Bar */}
        <div className="flex h-2 flex-col items-start justify-start gap-2 self-stretch rounded-[100px] bg-gray-100 pr-28">
          <div
            className={`h-2 w-[104px] rounded-[100px] bg-gradient-to-r ${types[type].color}`}
          />
        </div>
      </div>
    </div>
  );
}
