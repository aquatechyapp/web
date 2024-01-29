'use client';

import { useState } from 'react';
import ClientInfo from './ClientInfo';
import PoolsInfo from './PoolsInfo';

export default function DetailedClient() {
  const [tab, setTab] = useState<'client_info' | 'pools'>('client_info');

  const handleTabChange = (tab: 'client_info' | 'pools') => {
    setTab(tab);
  };

  return (
    <div>
      <div className="font-['Public Sans'] h-5 text-sm font-medium leading-tight tracking-tight text-zinc-500">
        Basic information
      </div>
      <div className="flex items-start gap-6 self-stretch">
        <div className="LeftCol inline-flex  w-[387px] flex-col items-start justify-start gap-7">
          <div className="UserDetail relative flex h-[698px] flex-col items-center justify-start gap-6 rounded-lg border border-zinc-200 bg-white px-6 pb-6 pt-16">
            <div className="w-[100% - 16px] absolute left-2 right-2 top-2 h-[148px] rounded bg-gradient-to-b from-sky-400 to-teal-400" />

            <div className="PhotoName flex h-[206px] flex-col items-center justify-start gap-3 self-stretch">
              <div className="Avatar z-10 inline-flex items-start justify-start gap-2">
                <img
                  className="Photo h-[140px] w-[140px] rounded-[100px]"
                  src="https://via.placeholder.com/140x140"
                />
              </div>
              <div className="NameStatus flex h-[54px] flex-col items-center justify-center gap-1 self-stretch">
                <div className="Text font-['Public Sans'] self-stretch text-center text-xl font-semibold leading-[30px] tracking-tight text-neutral-800">
                  Linda Blair
                </div>
                <div className="BillingAddress font-['Public Sans'] text-sm font-medium leading-tight tracking-tight text-gray-500">
                  Billing Address
                </div>
              </div>
            </div>
            <div className="Details flex flex-col items-center justify-start gap-[18px]">
              <div className="ListItem1Col inline-flex w-[312px] items-start justify-start gap-2">
                <div className="FiSrEnvelope relative h-[18px] w-[18px]" />
                <div className="Text inline-flex shrink grow basis-0 flex-col items-start justify-center gap-1">
                  <div className="Text font-['Public Sans'] self-stretch text-sm font-medium leading-tight tracking-tight text-gray-500">
                    Email
                  </div>
                  <div className="Text font-['Public Sans'] self-stretch text-sm font-medium leading-tight tracking-tight text-neutral-800">
                    lindablair@mail.com
                  </div>
                </div>
                <div className="Action flex items-center justify-center gap-2">
                  <div className="Icon flex h-[18px] w-[18px] items-center justify-center gap-2 p-2">
                    <div className="FiSrCopy relative h-4 w-4" />
                  </div>
                </div>
              </div>
              <div className="ListItem1Col inline-flex w-[312px] items-start justify-start gap-2">
                <div className="FiSrSmartphone relative h-[18px] w-[18px]" />
                <div className="Text inline-flex shrink grow basis-0 flex-col items-start justify-center gap-1">
                  <div className="Text font-['Public Sans'] self-stretch text-sm font-medium leading-tight tracking-tight text-gray-500">
                    Phone Number
                  </div>
                  <div className="Text font-['Public Sans'] self-stretch text-sm font-medium leading-tight tracking-tight text-neutral-800">
                    050 414 8788
                  </div>
                </div>
                <div className="Action flex items-center justify-center gap-2">
                  <div className="Icon flex h-[18px] w-[18px] items-center justify-center gap-2 p-2">
                    <div className="FiSrCopy relative h-4 w-4" />
                  </div>
                </div>
              </div>
              <div className="ListItem1Col inline-flex w-[312px] items-start justify-start gap-2">
                <div className="FiSrFileCheck relative h-[18px] w-[18px]" />
                <div className="Text inline-flex shrink grow basis-0 flex-col items-start justify-center gap-1">
                  <div className="Text font-['Public Sans'] self-stretch text-sm font-medium leading-tight tracking-tight text-gray-500">
                    Locations
                  </div>
                  <div className="Text font-['Public Sans'] self-stretch text-sm font-medium leading-tight tracking-tight text-neutral-800">
                    43 Project
                  </div>
                </div>
              </div>
              <div className="ListItem1Col inline-flex w-[312px] items-start justify-start gap-2">
                <div className="FiSrTimeCheck relative h-[18px] w-[18px]" />
                <div className="Text inline-flex shrink grow basis-0 flex-col items-start justify-center gap-1">
                  <div className="Text font-['Public Sans'] self-stretch text-sm font-medium leading-tight tracking-tight text-gray-500">
                    Last Service
                  </div>
                  <div className="Text font-['Public Sans'] self-stretch text-sm font-medium leading-tight tracking-tight text-neutral-800">
                    January, 17, 2024
                  </div>
                </div>
              </div>
              <div className="ListItem1Col inline-flex w-[312px] items-start justify-start gap-2">
                <div className="FiSrCalendar relative h-[18px] w-[18px]" />
                <div className="Text inline-flex shrink grow basis-0 flex-col items-start justify-center gap-1">
                  <div className="Text font-['Public Sans'] self-stretch text-sm font-medium leading-tight tracking-tight text-gray-500">
                    Joined
                  </div>
                  <div className="Text font-['Public Sans'] self-stretch text-sm font-medium leading-tight tracking-tight text-neutral-800">
                    12 December 2022
                  </div>
                </div>
              </div>
            </div>
            <div className="Action inline-flex items-start justify-start gap-4 self-stretch">
              <div className="PrimaryButton flex h-10 shrink grow basis-0 items-center justify-center gap-1 rounded-lg bg-gray-100 px-3.5 py-2.5">
                <div className="Icon flex h-5 w-5 items-center justify-center gap-2 p-2">
                  <div className="FiSrEnvelope relative h-4 w-4" />
                </div>
                <div className="Text font-['Public Sans'] text-sm font-semibold leading-tight tracking-tight text-neutral-800">
                  Email
                </div>
              </div>
              <div className="PrimaryButton flex h-10 shrink grow basis-0 items-center justify-center gap-1 rounded-lg bg-neutral-800 px-3.5 py-2.5">
                <div className="Icon flex h-5 w-5 items-center justify-center gap-2 p-2">
                  <div className="FiSrCommentAlt relative h-4 w-4" />
                </div>
                <div className="Text font-['Public Sans'] text-sm font-semibold leading-tight tracking-tight text-white">
                  Message
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-[100%] flex-col items-start  gap-7">
          <div className="RightCol inline-flex h-[827px]  w-[100%] flex-col items-start justify-start gap-7">
            <div className="Row inline-flex items-start justify-start gap-6 self-stretch">
              <div className="RightBadgeStatisticCard inline-flex shrink grow basis-0 flex-col items-start justify-start gap-4 rounded-lg border border-zinc-200 bg-white p-5">
                <div className="TitleNumbers inline-flex items-start justify-start gap-4 self-stretch">
                  <div className="TitleNumbers inline-flex shrink grow basis-0 flex-col items-start justify-start gap-2">
                    <div className="Text font-['Public Sans'] self-stretch text-base font-medium leading-normal tracking-tight text-zinc-500">
                      Montly payment
                    </div>
                    <div className="Text font-['Public Sans'] self-stretch text-[28px] font-semibold tracking-tight text-neutral-800">
                      $120
                    </div>
                  </div>
                  <div className="CircleIconBagde flex h-10 w-10 items-center justify-center gap-2 rounded-[100px] bg-gradient-to-b from-orange-500 to-yellow-400 p-2">
                    <div className="AttachMoney relative h-[18px] w-[18px]" />
                  </div>
                </div>
              </div>
              <div className="RightBadgeStatisticCard inline-flex shrink grow basis-0 flex-col items-start justify-start gap-4 rounded-lg border border-zinc-200 bg-white p-5">
                <div className="TitleNumbers inline-flex items-start justify-start gap-4 self-stretch">
                  <div className="TitleNumbers inline-flex shrink grow basis-0 flex-col items-start justify-start gap-2">
                    <div className="Text font-['Public Sans'] self-stretch text-base font-medium leading-normal tracking-tight text-zinc-500">
                      Services
                    </div>
                    <div className="Text font-['Public Sans'] self-stretch text-[28px] font-semibold tracking-tight text-neutral-800">
                      54
                    </div>
                  </div>
                  <div className="CircleIconBagde flex h-10 w-10 items-center justify-center gap-2 rounded-[100px] bg-gradient-to-b from-blue-600 to-sky-400 p-2">
                    <div className="FiSrTimeAdd relative h-[18px] w-[18px]" />
                  </div>
                </div>
              </div>
            </div>
            <div className="RegularTabs inline-flex items-start justify-start gap-4 self-stretch border-b border-zinc-200">
              <div
                onClick={() => handleTabChange('client_info')}
                className="RegularTab inline-flex flex-col items-start justify-start gap-2.5"
              >
                <div
                  className={`font-['Public Sans'] text-sm font-semibold leading-tight tracking-tight hover:cursor-pointer ${tab === 'client_info' ? 'text-neutral-800' : 'text-gray-500'}`}
                >
                  Basic information
                </div>
                {tab === 'client_info' && (
                  <div className="Rectangle2 h-0.5 self-stretch bg-neutral-800" />
                )}
              </div>
              <div
                onClick={() => handleTabChange('pools')}
                className="RegularTab inline-flex flex-col items-start justify-start gap-2.5"
              >
                <div
                  className={`font-['Public Sans'] text-sm font-medium leading-tight tracking-tight hover:cursor-pointer ${tab === 'pools' ? 'text-neutral-800' : 'text-gray-500'}`}
                >
                  Pools
                </div>
                {tab === 'pools' && (
                  <div className="Rectangle2 h-0.5 self-stretch bg-neutral-800" />
                )}
              </div>
            </div>
            {tab === 'client_info' ? <ClientInfo /> : <PoolsInfo />}
          </div>
        </div>
      </div>
    </div>
  );
}
