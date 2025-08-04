import Form from 'next/form';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';

export function AuthForm({
  action,
  children,
  defaultEmail = '',
  flow = "signIn",
  className,
  ...props
}: {
  action: NonNullable<
    string | ((formData: FormData) => void | Promise<void>) | undefined
  >;
  children?: React.ReactNode;
  defaultEmail?: string;
  flow: "signIn" | "signUp";
  className?: string;
} & React.ComponentProps<"div">) {
  return (
    <div className={className} {...props}>
      <Form action={action}>
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="user@acme.com"
              autoComplete="email"
              required
              autoFocus
              defaultValue={defaultEmail}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
            />
          </div>
          <input name="flow" type="hidden" value={flow} />
          {children}
        </div>
      </Form>
    </div>
  );
}