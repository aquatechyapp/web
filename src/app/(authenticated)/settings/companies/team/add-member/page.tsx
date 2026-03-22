import { redirect } from 'next/navigation';

export default function LegacyAddMemberRedirectPage() {
  redirect('/settings/companies');
}
