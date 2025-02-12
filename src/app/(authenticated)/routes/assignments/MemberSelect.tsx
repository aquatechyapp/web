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
import { useUserStore } from '@/store/user';

type Props = {
  onChange: (value: string) => void;
  defaultValue?: string;
};

export default function MemberSelect({ onChange }: Props) {
  const { assignmentToId, members } = useMembersStore(
    useShallow((state) => ({
      assignmentToId: state.assignmentToId,
      members: state.members
    }))
  );

  const user = useUserStore((state) => state.user);

  function handleChange(memberId: string) {
    onChange(memberId);
  }

  return (
    <div className="mt-2">
      {/* por padrão, o User logado é o tecnico selecionado */}
      <Select onValueChange={handleChange} defaultValue={assignmentToId}>
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
            {
              // If user has no company, add the user to the members array.
              members.length === 0 && (
                <SelectItem value={user.id}>
                  {user.firstName} {user.lastName}
                </SelectItem>
              )
            }
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
