import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import Link from 'next/link';

export default function AuthForm() {
  return (
    <div className="inline-flex h-[318px] w-[448px] flex-col items-start justify-start gap-[18px] rounded-lg bg-white px-6 py-8">
      <div className="inline-flex h-5 items-center justify-center gap-3 self-stretch">
        <div className="font-['General Sans'] shrink grow basis-0 self-stretch text-center text-2xl font-semibold leading-normal text-gray-600">
          Aquatechy
        </div>
      </div>
      <div className="relative h-[50px] w-[400px]">
        <div className="font-['Public Sans'] absolute left-0 top-0 h-[30px] w-[400px] text-xl font-semibold leading-[30px] tracking-tight text-neutral-800">
          Login
        </div>
        <div className="absolute left-0 top-[30px] h-5 w-[400px]">
          <span className="font-['Public Sans'] text-sm font-medium leading-tight tracking-tight text-zinc-500">
            Don't you have an account?{' '}
          </span>
          <Link
            href="/signup"
            className="font-['Public Sans'] text-sm font-bold leading-tight tracking-tight text-zinc-500"
          >
            Signup
          </Link>
        </div>
      </div>
      <div className="relative h-[92px] w-[400px]">
        <Input placeholder="E-mail address" />
        <PasswordInput className="mt-2" placeholder="Password" />
      </div>
      <button className="inline-flex items-center justify-center gap-2 self-stretch rounded-lg bg-indigo-600 p-3">
        <div className="font-['General Sans'] text-center text-sm font-medium leading-[14px] text-white">
          Login
        </div>
      </button>
    </div>
  );
}
