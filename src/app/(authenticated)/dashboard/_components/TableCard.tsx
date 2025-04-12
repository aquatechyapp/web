interface TableCardProps {
  title: string;
  items: {
    name: string;
    value?: string | number;
  }[];
}

export function TableCard({ title, items }: TableCardProps) {
  return (
    <div className="flex flex-1 flex-col rounded-lg border border-gray-200 bg-gradient-to-br from-blue-50 to-gray-100 p-6 shadow-sm">
      <h3 className="mb-4 text-sm font-medium text-blue-600">{title}</h3>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between">
            <span className="text-sm text-gray-700">{item.name}</span>
            {item.value && (
              <span className="text-sm font-medium text-blue-600">{item.value}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 