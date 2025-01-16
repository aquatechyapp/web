import { useShallow } from 'zustand/react/shallow';

import { useMembersStore } from '@/store/members';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../../../components/ui/select';
import { CompanyMember } from '@/ts/interfaces/Company';

type Props = {
  onChange: (value: string) => void;
  defaultValue?: string;
};

export default function MemberSelect({ onChange }: Props) {
  const { assignedToId, members } = useMembersStore(
    useShallow((state) => ({
      assignedToId: state.assignedToId,
      members: state.members
    }))
  );

  function handleChange(memberId: string) {
    onChange(memberId);
  }

  return (
    <div className="mt-2">
      <Select onValueChange={handleChange} defaultValue={assignedToId}>
        <SelectTrigger data-testid="select-member">
          <SelectValue placeholder="Member" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {members.map((member: CompanyMember) => (
              <SelectItem key={member.id} value={member.id}>
                {member.firstName} {member.lastName}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
