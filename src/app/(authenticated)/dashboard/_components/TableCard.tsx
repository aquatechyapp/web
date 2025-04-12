interface TableCardProps {
  title: string;
  items: {
    name: string;
    value?: string | number;
  }[];
}

const truncateText = (text: string, maxLength: number = 30) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
};

export function TableCard({ title, items }: TableCardProps) {
  const hasData = items && items.length > 0;

  return (
    <div className="flex flex-1 flex-col rounded-lg border border-gray-200 bg-gradient-to-br from-blue-50 to-gray-100 p-6 shadow-sm">
      <h3 className="mb-4 text-sm font-medium text-blue-600 truncate" title={title}>{truncateText(title)}</h3>
      {hasData ? (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between">
              <span className="text-sm text-gray-700 truncate" title={item.name}>{truncateText(item.name)}</span>
              {item.value && (
                <span className="text-sm font-medium text-blue-600 truncate" title={item.value.toString()}>{truncateText(item.value.toString())}</span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-20">
          <span className="text-sm text-gray-400">No data available</span>
        </div>
      )}
    </div>
  );
} 