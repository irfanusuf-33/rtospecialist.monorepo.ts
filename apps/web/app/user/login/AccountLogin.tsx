"use client";

import { useEffect, useState } from "react";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { validateLoginForm, resetpasswordForm } from '../../../client/js/accounts/accounts.js';
import URLUtils from "../../../scripts/UrlUtils";
import Alert from '../../../components/alerts/Alert';
import { usePageLoaderStore } from "../../../state/usePageLoaderStore";
import { useAccountsStore } from "../../../state/useAccountsStore";
import { useCartStore } from "../../../state/useCartStore";
import { useGuestCartStore } from "../../../state/useGuestCartStore";
import { useGlobalToastStore } from '../../../state/useGlobalToastStore';
import Turnstile from "react-turnstile";

export default function AccountLogin() {
  type FormErrors = {
    email?: string;
    password?: string;
    accounttype?: string;
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState<null | string>(null);
  const [formError, setFormError] = useState<FormErrors>({});
  const [captcha, setCaptcha] = useState<string | null>(null);

  const setLoading = usePageLoaderStore((state) => state.setLoading);
  const setCustomer = useAccountsStore((state) => state.setCustomer);
  const setBasketLength = useCartStore((state) => state.setUserCartLength);
  const setCartItems = useCartStore((state) => state.setItems);
  const guestCartProducts = useGuestCartStore((state) => state.products);
  const clearGuestCart = useGuestCartStore((state) => state.clearProducts);
  const setToastState = useGlobalToastStore((state) => state.setToastState);
  const router = useRouter();

  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => setPasswordShown((cur) => !cur);

  const searchParams = useSearchParams();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  useEffect(() => {
    if (searchParams.get("fromRegistration") === "1") {
      setShowSuccessAlert(true);
      router.replace('/user/login');
    }
  }, [router, searchParams]);

  const setRtoAccountType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAccountType(e.target.value);
    delete formError.accounttype;
  };

  const validateAndSubmitForm = async (e: React.MouseEvent) => {
    e.preventDefault();
    const form = validateLoginForm(email, password, accountType);
    if (!form.valid) {
      setFormError(form.obj);
    } else {
      try {
        setLoading(true);
        const res = accountType === "PDEV_USER"
          ? await URLUtils.post('General-PdevLogin', { form: { email, password }, captcha })
          : await URLUtils.post('Account-Login', { email, password, accountType, captcha, guestCartProducts });
        if (res.status === 200) {
          setCustomer(res.data.customerModel);
          setBasketLength(res.data.basketLength || 0);
          if (accountType !== "PDEV_USER" && guestCartProducts.length > 0) {
            setCartItems(guestCartProducts.map((product) => ({ id: product.productId, type: product.type })));
            clearGuestCart();
          }
          setTimeout(() => { router.replace('/accounts/settings'); }, 0);
        }
      } catch (e: unknown) {
        const err = e as { response?: { data?: { err?: string } } };
        setToastState({ html: err.response?.data?.err || err?.response?.data as string || 'some error occurred!', show: true });
      } finally {
        setLoading(false);
      }
    }
  };

  const beginResetPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    const form = resetpasswordForm(email, accountType);
    if (!form.valid) {
      setFormError(form.obj);
    } else {
      try {
        setLoading(true);
        const res = await URLUtils.post('Account-BeginPasswordReset', { email, type: accountType });
        if (res.status === 200) {
          alert('password reset link sent to your email.');
        }
      } catch {
        return;
      } finally {
        setLoading(false);
      }
    }
  };

  const inputBase = "mt-2 block w-full rounded-md border border-[#889397] px-4 h-11 text-xs outline-none transition-[outline] duration-300 focus:outline-2 focus:outline-black dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:outline-sky-500";
  const inputError = "border-[#dc2626] dark:border-red-500";
  const labelBase = "text-sm font-medium text-[#1D1D1D] dark:text-slate-200";
  const errMsg = "mt-1 text-xs text-[#7f1d1d] dark:text-red-400";

  return (
    <>
      {showSuccessAlert && (
        <Alert
          type="green"
          heading="Account created!"
          body="Your account was created successfully. Now you can enter your credentials to sign in"
        />
      )}
      <section className="grid min-h-screen items-center bg-[#f1f5f9] px-4 py-8 text-center dark:bg-slate-950">
        <div className="mx-2 rounded-lg bg-white px-8 py-8 shadow-[rgba(0,0,0,0.24)_0px_3px_8px] dark:bg-slate-900 dark:shadow-slate-950 sm:mx-auto sm:w-full sm:max-w-lg lg:w-1/2">
          <h1 className="text-[2.1875rem] font-semibold text-[#1D1D1D] dark:text-white">Sign In</h1>
          <p className="mb-12 mt-1 text-sm font-medium text-[#4b5563] dark:text-slate-400">
            Welcome back! let&#39;s signin
          </p>

          <form className="mx-auto max-w-[385px] text-left">
            {/* Email */}
            <div className="mb-6">
              <label htmlFor="email" className={labelBase}>Your Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); delete formError.email; }}
                placeholder="Enter your email address"
                className={`${inputBase} ${formError.email ? inputError : ''}`}
              />
              {formError.email && <span className={errMsg}>{formError.email}</span>}
            </div>

            {/* Password */}
            <div className="relative mb-6">
              <label htmlFor="password" className={labelBase}>Password</label>
              <input
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); delete formError.password; }}
                className={`${inputBase} ${formError.password ? inputError : ''}`}
                type={passwordShown ? "text" : "password"}
              />
              <span
                className="absolute right-[15px] top-10 cursor-pointer text-[#4b5563] dark:text-slate-400"
                onClick={togglePasswordVisiblity}
              >
                {passwordShown ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
              </span>
              {formError.password && <span className={errMsg}>{formError.password}</span>}
            </div>

            {/* Account type + reset */}
            <div className="mb-1">
              <div className="flex items-center justify-between">
                <p className={labelBase}>Account Type</p>
                <button
                  type="button"
                  className="text-xs text-[#1f2937] underline hover:underline-offset-2 dark:text-slate-300"
                  onClick={beginResetPassword}
                >
                  reset password?
                </button>
              </div>
              <div className="mt-3">
                <select
                  name="accountType"
                  className="mb-4 w-full rounded-md border border-[#9ca3af] px-3 py-[10px] text-sm text-[#1f2937] outline-none focus:border-[#0E74BC] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                  onChange={setRtoAccountType}
                  defaultValue="TYPE"
                >
                  <option value="TYPE" disabled>Select Account Type</option>
                  <option value="GENERAL">Client</option>
                  <option value="AFFILIATE">Partner</option>
                  <option value="JOBSEEKER">Job Seeker</option>
                  <option value="PDEV_USER">Professional Development User</option>
                </select>
              </div>
              <div className="mb-6">
                <Turnstile
                  sitekey={process.env.NEXT_PUBLIC_CLOUD_FLARE_SITE_KEY || ""}
                  onVerify={(token) => setCaptcha(token)}
                  onExpire={() => setCaptcha(null)}
                />
              </div>
              {formError.accounttype && <span className={errMsg}>{formError.accounttype}</span>}
            </div>

            {/* Submit */}
            <button
              className="mt-2 w-full rounded-md bg-[#1D1D1D] py-[10px] text-sm font-medium text-white transition-colors hover:bg-black dark:bg-sky-600 dark:hover:bg-sky-700"
              onClick={validateAndSubmitForm}
            >
              Sign in
            </button>

            {/* Footer */}
            <p className="mt-4 text-center text-xs font-normal text-[#4b5563] dark:text-slate-400">
              Not registered?{" "}
              <Link
                href="/user/create-account"
                className="font-medium text-[#1D1D1D] hover:underline hover:underline-offset-[2px] dark:text-sky-400"
              >
                Create account!
              </Link>
            </p>
          </form>
        </div>
      </section>
    </>
  );
}
