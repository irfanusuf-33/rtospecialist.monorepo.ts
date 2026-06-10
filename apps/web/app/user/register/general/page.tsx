'use client';

import { useState } from "react";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import Link from "next/link";
import { validateRtoSpecialistRegistrationForm } from '../../../../client/js/accounts/accounts';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Tooltip } from '@mui/material';
import { checkIfPasswordsMatch } from "../../../../client/js/main";
import { usePageLoaderStore } from "../../../../state/usePageLoaderStore";
import SignupEmailOtp from "../../../../extras/accountSettings/SignupEmailOtp";
import URLUtils from '../../../../scripts/UrlUtils';
import Turnstile from "react-turnstile";

export default function GeneralRegistration() {
  type AccountType = "GENERAL" | "AFFILIATE" | "JOBSEEKER";

  type FormErrorType = {
    accountType?: string;
    firstname?: string;
    lastname?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
    captcha?: string;
  };

  const accountTypeLabels: Record<AccountType, string> = {
    GENERAL: "Client",
    AFFILIATE: "Partner",
    JOBSEEKER: "JobSeeker",
  };

  const [formData, setFormData] = useState({
    accountType: "GENERAL" as AccountType,
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    otp: '',
    lead: '',
    marketingConsent: false,
    jobRole: '',
    interestType: '',
    company: '',
  });

  const [formError, setFormError] = useState<FormErrorType>({});
  const [otpForm, setOtpForm] = useState(false);
  const [captcha, setCaptcha] = useState<string | null>(null);

  const setLoading = usePageLoaderStore((state) => state.setLoading);
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => setPasswordShown((cur) => !cur);
  const handleOtpFormVisibility = () => setOtpForm((cur) => !cur);

  const submitEmail = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!formData.accountType) {
      setFormError((prev) => ({ ...prev, accountType: 'Select account type' }));
      return;
    }
    const form = validateRtoSpecialistRegistrationForm(formData);
    if (!form.valid) {
      setFormError({ ...form.obj, confirmPassword: form.obj.confirmpassword });
    } else {
      const match = checkIfPasswordsMatch(formData.password, formData.confirmPassword);
      if (!match) {
        setFormError({ confirmPassword: 'passwords do not match!' });
      } else if (!captcha) {
        setFormError((prev) => ({ ...prev, captcha: 'Complete the captcha to continue.' }));
      } else {
        try {
          setLoading(true);
          const res = await URLUtils.post('Account-EmailOtpSend', {
            email: formData.email,
            captcha,
            formData: {
              marketingConsent: formData.marketingConsent,
              jobRole: formData.jobRole,
              interestType: formData.interestType,
              company: formData.company,
            },
          });
          if (res.status === 200) {
            handleOtpFormVisibility();
            setLoading(false);
          }
        } catch {
          setLoading(false);
        }
      }
    }
  };

  // shared class strings
  const inputBase = "mt-2 block w-full rounded-md border border-[#889397] px-4 h-11 text-xs outline-none transition-[outline] duration-300 focus:outline-2 focus:outline-black dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:outline-sky-500";
  const inputErr = "border-[#dc2626] dark:border-red-500";
  const labelBase = "text-sm font-medium text-[#1D1D1D] dark:text-slate-200";
  const errMsg = "mt-1 text-xs text-[#7f1d1d] dark:text-red-400";
  const selectBase = `${inputBase} cursor-pointer`;

  return (
    <section className="grid min-h-screen bg-[#f1f5f9] px-4 py-8 text-center dark:bg-slate-950 sm:px-12">
      <div className="mx-auto mt-4 w-full rounded-lg bg-white px-8 py-8 shadow-[rgba(0,0,0,0.24)_0px_3px_8px] dark:bg-slate-900 dark:shadow-slate-950 sm:max-w-xl lg:w-1/2">
        {!otpForm ? (
          <div>
            <p className="text-[2.1875rem] font-semibold text-[#1D1D1D] dark:text-white">
              Create {accountTypeLabels[formData.accountType]} Account
            </p>
            <p className="mb-12 mt-1 text-sm font-medium text-[#4b5563] dark:text-slate-400">
              Welcome <span className="font-medium text-[#1D1D1D] dark:text-white">{formData.firstname}!</span> lets create your account
            </p>

            <form className="mx-auto max-w-[385px] text-left">

              {/* Register As */}
              <div className="mb-6 w-full">
                <p className={labelBase}>Register As <span className={errMsg}>*</span></p>
                <select
                  value={formData.accountType}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, accountType: e.target.value as AccountType }));
                    setFormError((prev) => { const u = { ...prev }; delete u.accountType; return u; });
                  }}
                  className={`${selectBase} ${formError.accountType ? inputErr : ''}`}
                >
                  <option value="GENERAL">Client</option>
                  <option value="AFFILIATE">Partner</option>
                  <option value="JOBSEEKER">JobSeeker</option>
                </select>
                {formError.accountType && <span className={errMsg}>{formError.accountType}</span>}
              </div>

              {/* First + Last name */}
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="mb-6 w-full">
                  <p className={labelBase}>First Name <span className={errMsg}>*</span></p>
                  <input
                    id="firstname" type="text" value={formData.firstname}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, firstname: e.target.value }));
                      setFormError((prev) => { const u = { ...prev }; delete u.firstname; return u; });
                    }}
                    placeholder="Enter your name"
                    className={`${inputBase} ${formError.firstname ? inputErr : ''}`}
                  />
                  {formError.firstname && <span className={errMsg}>{formError.firstname}</span>}
                </div>
                <div className="mb-6 w-full">
                  <p className={labelBase}>Last Name <span className={errMsg}>*</span></p>
                  <input
                    id="lastname" type="text" value={formData.lastname}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, lastname: e.target.value }));
                      setFormError((prev) => { const u = { ...prev }; delete u.lastname; return u; });
                    }}
                    placeholder="Enter your lastname"
                    className={`${inputBase} ${formError.lastname ? inputErr : ''}`}
                  />
                  {formError.lastname && <span className={errMsg}>{formError.lastname}</span>}
                </div>
              </div>

              {/* Email */}
              <div className="mb-6 w-full">
                <p className={labelBase}>Email ID <span className={errMsg}>*</span></p>
                <input
                  id="email" type="email" value={formData.email}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, email: e.target.value }));
                    setFormError((prev) => { const u = { ...prev }; delete u.email; return u; });
                  }}
                  placeholder="Enter your email id"
                  className={`${inputBase} ${formError.email ? inputErr : ''}`}
                />
                {formError.email && <span className={errMsg}>{formError.email}</span>}
              </div>

              {/* Phone */}
              <div className="mb-6 w-full">
                <p className={labelBase}>Phone Number <span className={errMsg}>*</span></p>
                <input
                  id="phonenumber" type="tel" value={formData.phone}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, phone: e.target.value }));
                    setFormError((prev) => { const u = { ...prev }; delete u.phone; return u; });
                  }}
                  placeholder="Enter your number"
                  className={`${inputBase} ${formError.phone ? inputErr : ''}`}
                />
                {formError.phone && <span className={errMsg}>{formError.phone}</span>}
              </div>

              {/* Password */}
              <div className="relative mb-6 w-full">
                <p className={labelBase}>
                  Password <span className={errMsg}>*</span>
                  <Tooltip title="Use at least 8 characters, one uppercase, one lowercase, one special character and one number." arrow placement="top">
                    <InfoOutlinedIcon sx={{ fontSize: 15, ml: 0.5, cursor: 'pointer' }} />
                  </Tooltip>
                </p>
                <input
                  placeholder="enter your password" value={formData.password}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, password: e.target.value }));
                    setFormError((prev) => { const u = { ...prev }; delete u.password; return u; });
                  }}
                  className={`${inputBase} ${formError.password ? inputErr : ''}`}
                  type={passwordShown ? "text" : "password"}
                />
                <span className="absolute right-[15px] top-10 cursor-pointer text-[#4b5563] dark:text-slate-400" onClick={togglePasswordVisiblity}>
                  {passwordShown ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                </span>
                {formError.password && <span className={errMsg}>{formError.password}</span>}
              </div>

              {/* Confirm Password */}
              <div className="relative mb-6 w-full">
                <p className={labelBase}>Confirm Password <span className={errMsg}>*</span></p>
                <input
                  placeholder="confirm your password" value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }));
                    setFormError((prev) => { const u = { ...prev }; delete u.confirmPassword; return u; });
                  }}
                  className={`${inputBase} ${formError.confirmPassword ? inputErr : ''}`}
                  type="password"
                />
                {formData.password === formData.confirmPassword && formData.password.length > 0 && (
                  <span className="absolute right-[15px] top-10">
                    <CheckCircleOutlineOutlinedIcon sx={{ color: "#16a34a" }} />
                  </span>
                )}
                {formError.confirmPassword && <span className={errMsg}>{formError.confirmPassword}</span>}
              </div>

              {/* Marketing consent */}
              <div className="mb-6 w-full">
                <div className="rounded-lg bg-[#f9fafb] p-4 dark:bg-slate-800">
                  <label className="mb-3 flex cursor-pointer items-start gap-2">
                    <input
                      type="checkbox"
                      checked={formData.marketingConsent}
                      onChange={(e) => setFormData((prev) => ({ ...prev, marketingConsent: e.target.checked }))}
                      className="mt-1 accent-[#0E74BC]"
                    />
                    <span className="text-sm text-[#374151] dark:text-slate-300">
                      I would like to receive marketing updates, product news, resources, and promotional communications from RTO Specialist.
                    </span>
                  </label>

                  {formData.marketingConsent && (
                    <div className="mt-3 flex flex-col gap-3 pl-6">
                      <div>
                        <label className="mb-1 block text-xs text-[#6b7280] dark:text-slate-400">Job Role (Optional)</label>
                        <select value={formData.jobRole} onChange={(e) => setFormData((prev) => ({ ...prev, jobRole: e.target.value }))} className={selectBase}>
                          <option value="">Select Job Role</option>
                          <option value="CEO / Owner">CEO / Owner</option>
                          <option value="Compliance Manager">Compliance Manager</option>
                          <option value="RTO Manager">RTO Manager</option>
                          <option value="Head of Training">Head of Training</option>
                          <option value="Trainer / Assessor">Trainer / Assessor</option>
                          <option value="Administration / Operations">Administration / Operations</option>
                          <option value="Consultant">Consultant</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-[#6b7280] dark:text-slate-400">Interest (Optional)</label>
                        <select value={formData.interestType} onChange={(e) => setFormData((prev) => ({ ...prev, interestType: e.target.value }))} className={selectBase}>
                          <option value="">Select Interest</option>
                          <option value="Training Resources">Training Resources</option>
                          <option value="Membership">Membership</option>
                          <option value="Professional Development">Professional Development</option>
                          <option value="Compliance Support">Compliance Support</option>
                          <option value="Buy/ Sell /Lease RTO">Buy/ Sell /Lease RTO</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-[#6b7280] dark:text-slate-400">Company (Optional)</label>
                        <input
                          type="text" value={formData.company}
                          onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                          placeholder="Your company name"
                          className={inputBase}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Captcha */}
              <div className="mb-6 w-full">
                <Turnstile
                  sitekey={process.env.NEXT_PUBLIC_CLOUD_FLARE_SITE_KEY || ""}
                  onVerify={(token) => {
                    setCaptcha(token);
                    setFormError((prev) => { const u = { ...prev }; delete u.captcha; return u; });
                  }}
                  onExpire={() => setCaptcha(null)}
                />
                {formError.captcha && <span className={errMsg}>{formError.captcha}</span>}
              </div>

              {/* Submit */}
              <button
                className="w-full rounded-md bg-[#1D1D1D] py-[10px] text-sm font-medium text-white transition-colors hover:bg-black dark:bg-sky-600 dark:hover:bg-sky-700"
                onClick={submitEmail}
              >
                Create your account
              </button>

              {/* Footer */}
              <p className="mt-4 text-center text-xs font-normal text-[#4b5563] dark:text-slate-400">
                Already have an account?{" "}
                <Link href="/user/login" className="font-medium text-[#1D1D1D] hover:underline hover:underline-offset-[2px] dark:text-sky-400">
                  Login
                </Link>
              </p>
            </form>
          </div>
        ) : (
          <SignupEmailOtp formData={formData} type={formData.accountType} />
        )}
      </div>
    </section>
  );
}
