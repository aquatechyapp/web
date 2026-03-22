import { redirect } from 'next/navigation';

export default function TeamRedirectPage() {
  redirect('/settings/companies');
}
