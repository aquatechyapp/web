type Props = {
  title: string;
  description: string;
  subtitle?: string;
  children: React.ReactNode;
};

export default function InfoCardScrollable({
  title,
  description,
  subtitle,
  children
}: Props) {
  return (
    <div className="ListGroup inline-flex h-[422px] shrink grow basis-0 flex-col items-center justify-start gap-4 rounded-lg border border-zinc-200 bg-white p-6 ">
      <div className="Header inline-flex items-start justify-start gap-3 self-stretch">
        <div className="Title inline-flex shrink grow basis-0 flex-col items-start justify-start gap-0.5">
          <div className="inline-flex items-baseline gap-3 self-stretch">
            <div className="text-xl font-semibold  tracking-tight text-neutral-800">
              {title}
            </div>
            <div className="text-sm font-medium text-gray-500">{subtitle}</div>
          </div>
          <div className="Text font-['Public Sans'] text-sm font-medium leading-tight tracking-tight text-gray-500">
            {description}
          </div>
        </div>
      </div>
      <div className="List flex h-80 flex-col items-start justify-start gap-4 self-stretch overflow-auto">
        {children}
      </div>
    </div>
  );
}
