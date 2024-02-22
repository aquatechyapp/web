export default function NamePhoto({ cell }) {
  const { photo, name, email1 } = cell.row.original;
  return (
    <div className="flex">
      <div className="h-11 w-11 rounded-full">
        <img
          src={photo ?? `https://via.placeholder.com/80x80`}
          alt="Client photo"
        />
      </div>
      <div className="flex flex-col ml-4">
        <span>{name}</span>
        <span>{email1}</span>
      </div>
    </div>
  );
}
