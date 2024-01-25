type Props = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export default function InfoCardScrollable({
  title,
  description,
  children
}: Props) {
  return (
    <div className="ListGroup inline-flex h-[422px] shrink grow basis-0 flex-col items-center justify-start gap-4 rounded-lg border border-zinc-200 bg-white p-6 ">
      <div className="Header inline-flex items-start justify-start gap-3 self-stretch">
        <div className="Title inline-flex shrink grow basis-0 flex-col items-start justify-start gap-0.5">
          <div className="Title inline-flex items-center justify-start gap-3 self-stretch">
            <div className="Text font-['Public Sans'] text-xl font-semibold leading-[30px] tracking-tight text-neutral-800">
              {title}
            </div>
          </div>
          <div className="Text font-['Public Sans'] text-sm font-medium leading-tight tracking-tight text-gray-500">
            {description}
          </div>
        </div>
        <div className="KebabMenu flex h-5 w-5 items-center justify-center gap-2 p-2">
          <div className="FiRrMenuDotsVertical relative h-4 w-4" />
        </div>
      </div>
      <div className="List flex h-80 flex-col items-start justify-start gap-4 self-stretch overflow-auto">
        {children}
      </div>
    </div>
  );
}
