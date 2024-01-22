import ActionButton from './ActionButton';
import StatisticCard from './StatisticCard';

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
          <StatisticCard type="customers" />
        </div>
        <div className="Row inline-flex items-start justify-start gap-6 self-stretch">
          <ActionButton type="add_client" />
          <ActionButton type="route_dashboard" />
          <ActionButton type="my_team" />
        </div>
        <div className="Frame212 inline-flex w-[1147px] items-start justify-start gap-6">
          <div className="ListGroup inline-flex h-[422px] shrink grow basis-0 flex-col items-center justify-start gap-4 rounded-lg border border-zinc-200 bg-white p-6">
            <div className="Header inline-flex items-start justify-start gap-3 self-stretch">
              <div className="Title inline-flex shrink grow basis-0 flex-col items-start justify-start gap-0.5">
                <div className="Title inline-flex items-center justify-start gap-3 self-stretch">
                  <div className="Text font-['Public Sans'] text-xl font-semibold leading-[30px] tracking-tight text-neutral-800">
                    Clients by city
                  </div>
                </div>
                <div className="Text font-['Public Sans'] text-sm font-medium leading-tight tracking-tight text-gray-500">
                  Highest to Lowest
                </div>
              </div>
              <div className="KebabMenu flex h-5 w-5 items-center justify-center gap-2 p-2">
                <div className="FiRrMenuDotsVertical relative h-4 w-4" />
              </div>
            </div>
            <div className="List flex h-80 flex-col items-start justify-start gap-4 self-stretch">
              <div className="ListItem2Col inline-flex items-center justify-start gap-2 self-stretch">
                <div className="ImgText flex h-10 shrink grow basis-0 items-center justify-center gap-2">
                  <img
                    className="Img h-10 w-10 rounded-[99px]"
                    src="https://via.placeholder.com/40x40"
                  />
                  <div className="Text inline-flex shrink grow basis-0 flex-col items-start justify-center gap-0.5">
                    <div className="Text font-['Public Sans'] self-stretch text-sm font-medium leading-tight tracking-tight text-neutral-800">
                      Pompano Beach
                    </div>
                    <div className="Subtext font-['Public Sans'] self-stretch text-xs font-normal leading-[18px] tracking-tight text-gray-500">
                      23 clients
                    </div>
                  </div>
                </div>
              </div>
              <div className="ListItem2Col inline-flex items-center justify-start gap-2 self-stretch">
                <div className="ImgText flex h-10 shrink grow basis-0 items-center justify-center gap-2">
                  <img
                    className="Img h-10 w-10 rounded-[99px]"
                    src="https://via.placeholder.com/40x40"
                  />
                  <div className="Text inline-flex shrink grow basis-0 flex-col items-start justify-center gap-0.5">
                    <div className="Text font-['Public Sans'] self-stretch text-sm font-medium leading-tight tracking-tight text-neutral-800">
                      Fort Lauderdale
                    </div>
                    <div className="Subtext font-['Public Sans'] self-stretch text-xs font-normal leading-[18px] tracking-tight text-gray-500">
                      15 clients
                    </div>
                  </div>
                </div>
              </div>
              <div className="ListItem2Col inline-flex items-center justify-start gap-2 self-stretch">
                <div className="ImgText flex h-10 shrink grow basis-0 items-center justify-center gap-2">
                  <img
                    className="Img h-10 w-10 rounded-[99px]"
                    src="https://via.placeholder.com/40x40"
                  />
                  <div className="Text inline-flex shrink grow basis-0 flex-col items-start justify-center gap-0.5">
                    <div className="Text font-['Public Sans'] self-stretch text-sm font-medium leading-tight tracking-tight text-neutral-800">
                      Lake Worth
                    </div>
                    <div className="Subtext font-['Public Sans'] self-stretch text-xs font-normal leading-[18px] tracking-tight text-gray-500">
                      14 clients
                    </div>
                  </div>
                </div>
              </div>
              <div className="ListItem2Col inline-flex items-center justify-start gap-2 self-stretch">
                <div className="ImgText flex h-10 shrink grow basis-0 items-center justify-center gap-2">
                  <img
                    className="Img h-10 w-10 rounded-[99px]"
                    src="https://via.placeholder.com/40x40"
                  />
                  <div className="Text inline-flex shrink grow basis-0 flex-col items-start justify-center gap-0.5">
                    <div className="Text font-['Public Sans'] self-stretch text-sm font-medium leading-tight tracking-tight text-neutral-800">
                      Deerfield Beach
                    </div>
                    <div className="Subtext font-['Public Sans'] self-stretch text-xs font-normal leading-[18px] tracking-tight text-gray-500">
                      13 clients
                    </div>
                  </div>
                </div>
              </div>
              <div className="ListItem2Col inline-flex items-center justify-start gap-2 self-stretch">
                <div className="ImgText flex h-10 shrink grow basis-0 items-center justify-center gap-2">
                  <img
                    className="Img h-10 w-10 rounded-[99px]"
                    src="https://via.placeholder.com/40x40"
                  />
                  <div className="Text inline-flex shrink grow basis-0 flex-col items-start justify-center gap-0.5">
                    <div className="Text font-['Public Sans'] self-stretch text-sm font-medium leading-tight tracking-tight text-neutral-800">
                      Coral Springs
                    </div>
                    <div className="Subtext font-['Public Sans'] self-stretch text-xs font-normal leading-[18px] tracking-tight text-gray-500">
                      12 clients
                    </div>
                  </div>
                </div>
              </div>
              <div className="ListItem2Col inline-flex items-center justify-start gap-2 self-stretch">
                <div className="ImgText flex h-10 shrink grow basis-0 items-center justify-center gap-2">
                  <img
                    className="Img h-10 w-10 rounded-[99px]"
                    src="https://via.placeholder.com/40x40"
                  />
                  <div className="Text inline-flex shrink grow basis-0 flex-col items-start justify-center gap-0.5">
                    <div className="Text font-['Public Sans'] self-stretch text-sm font-medium leading-tight tracking-tight text-neutral-800">
                      Boynton Beach
                    </div>
                    <div className="Subtext font-['Public Sans'] self-stretch text-xs font-normal leading-[18px] tracking-tight text-gray-500">
                      11 clients
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="ListGroup inline-flex h-[422px] shrink grow basis-0 flex-col items-center justify-start gap-4 rounded-lg border border-zinc-200 bg-white p-6">
            <div className="Header inline-flex items-start justify-start gap-3 self-stretch">
              <div className="Title inline-flex shrink grow basis-0 flex-col items-start justify-start gap-0.5">
                <div className="Title inline-flex items-center justify-start gap-3 self-stretch">
                  <div className="Text font-['Public Sans'] text-xl font-semibold leading-[30px] tracking-tight text-neutral-800">
                    Your team
                  </div>
                </div>
                <div className="Text font-['Public Sans'] text-sm font-medium leading-tight tracking-tight text-gray-500">
                  Check your technicians status
                </div>
              </div>
              <div className="KebabMenu flex h-5 w-5 items-center justify-center gap-2 p-2">
                <div className="FiRrMenuDotsVertical relative h-4 w-4" />
              </div>
            </div>
            <div className="List flex h-24 flex-col items-start justify-start gap-4 self-stretch">
              <div className="ListItem2Col inline-flex items-center justify-start gap-2 self-stretch">
                <div className="ImgText flex h-10 shrink grow basis-0 items-center justify-center gap-2">
                  <img
                    className="Img h-10 w-10 rounded-[99px]"
                    src="https://via.placeholder.com/40x40"
                  />
                  <div className="Text inline-flex shrink grow basis-0 flex-col items-start justify-center gap-0.5">
                    <div className="Text font-['Public Sans'] self-stretch text-sm font-medium leading-tight tracking-tight text-neutral-800">
                      Kawan R. Strelow
                    </div>
                    <div className="Subtext font-['Public Sans'] self-stretch text-xs font-normal leading-[18px] tracking-tight text-gray-500">
                      103 clients - 110 pools - 115 visits
                    </div>
                  </div>
                </div>
              </div>
              <div className="ListItem2Col inline-flex items-center justify-start gap-2 self-stretch">
                <div className="ImgText flex h-10 shrink grow basis-0 items-center justify-center gap-2">
                  <img
                    className="Img h-10 w-10 rounded-[99px]"
                    src="https://via.placeholder.com/40x40"
                  />
                  <div className="Text inline-flex shrink grow basis-0 flex-col items-start justify-center gap-0.5">
                    <div className="Text font-['Public Sans'] self-stretch text-sm font-medium leading-tight tracking-tight text-neutral-800">
                      Júnior Portugal
                    </div>
                    <div className="Subtext font-['Public Sans'] self-stretch text-xs font-normal leading-[18px] tracking-tight text-gray-500">
                      110 clients - 110 pools - 113 visits
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="ColWheel inline-flex shrink grow basis-0 flex-col items-center justify-center gap-6 rounded-lg border border-zinc-200 bg-white p-6">
            <div className="Header inline-flex items-start justify-start gap-3 self-stretch">
              <div className="Title inline-flex shrink grow basis-0 flex-col items-start justify-start gap-0.5">
                <div className="Text font-['Public Sans'] self-stretch text-xl font-semibold leading-[30px] tracking-tight text-neutral-800">
                  Pool chemicals type
                </div>
                <div className="Text font-['Public Sans'] text-sm font-medium leading-tight tracking-tight text-zinc-500">
                  Based on chlorination system
                </div>
              </div>
              <div className="KebabMenu flex h-5 w-5 items-center justify-center gap-2 p-2">
                <div className="FiRrMenuDotsVertical relative h-4 w-4" />
              </div>
            </div>
            <div className="Wheel flex flex-col items-center justify-start">
              <div className="Chart relative h-[254px] w-[254px]">
                <div className="Ellipse141 absolute left-0 top-0 h-[254px] w-[254px] rounded-full bg-gradient-to-b from-sky-400 to-sky-200" />
                <div className="Ellipse141 absolute left-0 top-0 h-[254px] w-[254px] rounded-full bg-gradient-to-b from-purple-700 to-purple-300" />
              </div>
            </div>
            <div className="Details flex h-5 flex-col items-center justify-center gap-3.5 self-stretch">
              <div className="Details inline-flex items-start justify-start gap-3.5 self-stretch">
                <div className="Detail flex h-5 shrink grow basis-0 items-center justify-start gap-2">
                  <div className="Dot h-3 w-3 rounded-[10px] bg-gradient-to-b from-purple-700 to-purple-300" />
                  <div className="Text font-['Public Sans'] shrink grow basis-0 text-sm font-medium leading-tight tracking-tight text-gray-500">
                    Chlorine (65%)
                  </div>
                </div>
                <div className="Detail flex h-5 shrink grow basis-0 items-center justify-start gap-2">
                  <div className="Dot h-3 w-3 rounded-[10px] bg-gradient-to-b from-sky-400 to-sky-200" />
                  <div className="Text font-['Public Sans'] shrink grow basis-0 text-sm font-medium leading-tight tracking-tight text-gray-500">
                    Salt (35%)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
