export default function Phones({ cell }) {
  const { phone1, phone2 } = cell.row.original;
  return (
    <div className="flex flex-col">
      <span>Primary {phone1}</span>
      <span>Secondary {phone2}</span>
    </div>
  );
}
