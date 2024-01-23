import ActionButton from './ActionButton';
import InfoCardScrollable from './InfoCardScrollable';
import InfoItem from './InfoItem';
import StatisticCard from './StatisticCard';

const infos = [
  {
    title: 'Pompano Beach',
    description: '23 clients'
  },
  {
    title: 'Pompano Beach',
    description: '23 clients'
  },
  {
    title: 'Pompano Beach',
    description: '23 clients'
  },
  {
    title: 'Pompano Beach',
    description: '23 clients'
  },
  {
    title: 'Pompano Beach',
    description: '23 clients'
  },
  {
    title: 'Pompano Beach',
    description: '23 clients'
  },
  {
    title: 'Pompano Beach',
    description: '23 clients'
  },
  {
    title: 'Pompano Beach',
    description: '23 clients'
  }
];

export default function Dashboard() {
  return (
    <div>
      <div className="my-7 text-2xl font-semibold text-gray-800">
        January, 2024 (01/01 - 01/09)
      </div>
      <div className="Frame211 inline-flex h-[665px] flex-col items-start justify-start gap-6">
        <div className="Row inline-flex items-start justify-start gap-6 self-stretch">
          <StatisticCard type="income" />
          <StatisticCard type="expenses" />
          <StatisticCard type="profit" />
          <StatisticCard type="clients" />
        </div>
        <div className="Row inline-flex items-start justify-start gap-6 self-stretch">
          <ActionButton type="add_client" />
          <ActionButton type="route_dashboard" />
          <ActionButton type="my_team" />
        </div>
        <div className="Frame212 inline-flex w-[1147px] items-start justify-start gap-6">
          <InfoCardScrollable
            title="Clients by city"
            description="Highest to lowest"
          >
            {infos.map((info) => (
              <InfoItem
                title={info.title}
                description={info.description}
                iconUrl={info?.iconUrl}
              />
            ))}
          </InfoCardScrollable>
          <InfoCardScrollable
            title="Your team"
            description="Check your technicians status"
          >
            {infos.map((info) => (
              <InfoItem
                title={info.title}
                description={info.description}
                iconUrl={info?.iconUrl}
              />
            ))}
          </InfoCardScrollable>
          <InfoCardScrollable
            title="Pool chemicals type"
            description="Based on chlorination system"
          >
            Componente de gráfico
          </InfoCardScrollable>
        </div>
      </div>
    </div>
  );
}
