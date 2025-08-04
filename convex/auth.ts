import { Anonymous } from '@convex-dev/auth/providers/Anonymous';
import { Password } from '@convex-dev/auth/providers/Password';
import { convexAuth } from '@convex-dev/auth/server';
import Google from "@auth/core/providers/google"
import { ResendOTP } from './otp';


export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  // Todo : actually use resend otp here
  providers: [Password, Anonymous, ResendOTP, Google],
});
