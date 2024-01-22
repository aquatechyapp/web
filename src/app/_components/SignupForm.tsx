import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import Link from 'next/link';

export default function SignupForm() {
  return (
    <div className="inline-flex h-[680px] w-[480px] flex-col items-start justify-start gap-[18px] rounded-lg bg-white px-6 py-8">
      <div className="inline-flex h-5 items-center justify-center gap-3 self-stretch">
        <div className="font-['General Sans'] shrink grow basis-0 self-stretch text-center text-2xl font-semibold leading-normal text-gray-600">
          Aquatechy
        </div>
      </div>
      <div className="relative h-[50px] w-[400px]">
        <div className="font-['Public Sans'] absolute left-0 top-0 h-[30px] w-[400px] text-xl font-semibold leading-[30px] tracking-tight text-neutral-800">
          Signup
        </div>
        <div className="absolute left-0 top-[30px] h-5 w-[400px]">
          <span className="font-['Public Sans'] text-sm font-medium leading-tight tracking-tight text-zinc-500">
            Already have an account?{' '}
          </span>
          <Link
            href="/login"
            className="font-['Public Sans'] text-sm font-bold leading-tight tracking-tight text-zinc-500"
          >
            Login
          </Link>
        </div>
      </div>
      <div className="flex h-10 flex-col items-start justify-start gap-1 self-stretch">
        <div className="inline-flex h-10 items-center justify-center gap-2 self-stretch rounded-lg border border-zinc-200 bg-white px-3 py-2.5">
          <div className="font-['Public Sans'] shrink grow basis-0 text-sm font-medium leading-tight tracking-tight text-zinc-500">
            Register as a person or as a company?
          </div>
          <div className="flex h-5 w-5 items-center justify-center gap-2 p-2">
            <div className="relative h-4 w-4" />
          </div>
        </div>
      </div>
      <div className="inline-flex items-start justify-start gap-[18px] self-stretch">
        <div className="flex h-10 shrink grow basis-0 items-center justify-start gap-1 ">
          <Input placeholder="First name" />
        </div>
        <div className="flex h-10 shrink grow basis-0 items-center justify-start gap-1 rounded-lg">
          <div className="flex h-6 shrink grow basis-0 items-center justify-start gap-2">
            <Input placeholder="Last name" />
          </div>
        </div>
      </div>
      <div className="inline-flex w-[432px] items-center justify-start gap-1">
        <Input placeholder="Company" />
      </div>
      <div className="inline-flex w-[432px] items-center justify-start gap-1">
        <Input placeholder="Phone number" />
      </div>
      <div className="inline-flex w-[432px] items-center justify-start gap-1">
        <Input placeholder="E-mail" />
      </div>
      <div className="inline-flex items-start justify-start gap-[18px] self-stretch">
        <div className="flex h-10 shrink grow basis-0 items-center justify-start gap-1 rounded-lg border border-zinc-200 bg-white px-3 py-2">
          <div className="flex h-6 shrink grow basis-0 items-center justify-start gap-2">
            <div className="font-['Public Sans'] text-sm font-normal leading-tight tracking-tight text-gray-400">
              State
            </div>
          </div>
          <div className="flex h-5 w-5 items-center justify-center gap-2 p-2">
            <div className="relative h-4 w-4" />
          </div>
        </div>
        <div className="flex h-10 shrink grow basis-0 items-center justify-start gap-1 rounded-lg border border-zinc-200 bg-white px-3 py-2">
          <div className="flex h-6 shrink grow basis-0 items-center justify-start gap-2">
            <div className="font-['Public Sans'] text-sm font-normal leading-tight tracking-tight text-gray-400">
              City
            </div>
          </div>
          <div className="flex h-5 w-5 items-center justify-center gap-2 p-2">
            <div className="relative h-4 w-4" />
          </div>
        </div>
      </div>
      <div className="inline-flex items-center justify-center gap-2 self-stretch ">
        <div className="font-['Public Sans'] shrink grow basis-0 text-sm font-normal leading-tight tracking-tight text-gray-400">
          <PasswordInput className="mt-2" placeholder="Password" />
        </div>
      </div>
      <div className="inline-flex items-center justify-center gap-2 self-stretch ">
        <div className="font-['Public Sans'] shrink grow basis-0 text-sm font-normal leading-tight tracking-tight text-gray-400">
          <PasswordInput className="mt-2" placeholder="Confirm password" />
        </div>
      </div>
      <div className="inline-flex items-center justify-center gap-2 self-stretch rounded-lg bg-indigo-600 p-3">
        <div className="font-['General Sans'] text-center text-sm font-medium leading-[14px] text-white">
          Login
        </div>
      </div>
    </div>
  );
}
