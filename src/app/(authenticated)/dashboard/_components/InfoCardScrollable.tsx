type Props = {
  title: string;
  description?: string;
  subtitle?: string;
  children: React.ReactNode;
};

export default function InfoCardScrollable({ title, description, subtitle, children }: Props) {
  return (
    <div className="inline-flex h-full w-full flex-col items-center justify-start gap-4 rounded-lg border border-gray-200 bg-gray-50 p-6">
      <div className="inline-flex items-start justify-start gap-3 self-stretch">
        <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-0.5">
          <div className="inline-flex items-baseline gap-3 self-stretch">
            <div className="text-xl font-semibold text-gray-800">{title}</div>
            <div className="text-sm font-medium text-gray-500">{subtitle}</div>
          </div>
          <div className="text-sm font-medium text-gray-500">{description}</div>
        </div>
      </div>
      <div className="flex h-80 flex-col items-start justify-start gap-4 self-stretch overflow-auto">{children}</div>
    </div>
  );
}
