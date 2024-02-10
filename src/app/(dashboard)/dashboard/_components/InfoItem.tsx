import Image from 'next/image';

type Props = {
  title: string;
  description: string;
  iconUrl?: string;
};

export default function InfoItem({ title, description, iconUrl }: Props) {
  return (
    <div className="ListItem2Col inline-flex items-center justify-start gap-2 self-stretch ">
      <div className="ImgText flex h-10 shrink grow basis-0 items-center justify-center gap-2">
        {iconUrl ? (
          <Image src={iconUrl} alt="A little icon about an information" />
        ) : (
          <img
            className="Img h-10 w-10 rounded-[99px]"
            src="https://via.placeholder.com/40x40"
          />
        )}
        <div className="Text inline-flex shrink grow basis-0 flex-col items-start justify-center gap-0.5">
          <div className="Text font-['Public Sans'] self-stretch text-sm font-medium leading-tight tracking-tight text-neutral-800">
            {title}
          </div>
          <div className="Subtext font-['Public Sans'] self-stretch text-xs font-normal leading-[18px] tracking-tight text-gray-500">
            {description}
          </div>
        </div>
      </div>
    </div>
  );
}
