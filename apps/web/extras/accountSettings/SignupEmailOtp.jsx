'use client';

import { useState } from "react";
import { verifyEmailOtp } from "../../client/js/accounts/accounts";
import { usePageLoaderStore } from "../../state/usePageLoaderStore";
import { useGtmStore } from "../../state/useGtmStore";
import { useGlobalToastStore } from "../../state/useGlobalToastStore";
import { useRouter } from "next/navigation";
import URLUtils from "../../scripts/UrlUtils";

const types = ['GENERAL', 'AFFILIATE', 'JOBSEEKER'];

export default function SignupEmailOtp({ formData, type }) {
  const [otpErr, setOtpErr] = useState('');
  const [otp, setOtp] = useState(null);

  const setLoading = usePageLoaderStore((state) => state.setLoading);
  const setToastState = useGlobalToastStore((state) => state.setToastState);
  const lead = useGtmStore((state) => state.activeConsultingLead);
  const router = useRouter();

  const submitForm = (e) => {
    e.preventDefault();
    const form = verifyEmailOtp(otp);
    if (!form.valid) {
      setOtpErr(form.obj.otp);
    } else {
      formData.otp = otp;
      delete formData.confirmPassword;
      if (type === types[0]) {
        formData.lead = lead;
        submitGeneralRegistrationForm(formData);
      } else if (type === types[1]) {
        submitAffiliateRegistrationForm(formData);
      } else if (type === types[2]) {
        submitJobSeekerRegistrationForm(formData);
      }
    }
  };

  const submitGeneralRegistrationForm = async (formData) => {
    setLoading(true);
    try {
      const res = await URLUtils.post('General-Save', { form: formData });
      if (res.status === 200) {
        setLoading(false);
        router.replace('/user/login');
      }
    } catch (e) {
      setToastState({ html: e.response?.data?.err || 'some error occurred!', show: true });
    } finally {
      setLoading(false);
    }
  };

  const submitAffiliateRegistrationForm = async () => {
    setLoading(true);
    try {
      const res = await URLUtils.post('Affiliate-Save', { form: formData });
      if (res.status === 200) {
        setLoading(false);
        router.replace('/user/login');
        setToastState({ html: 'Account created successfully!', show: true });
      }
    } catch (e) {
      setToastState({ html: e.response?.data?.err || 'some error occurred!', show: true });
    } finally {
      setLoading(false);
    }
  };

  const submitJobSeekerRegistrationForm = async () => {
    setLoading(true);
    try {
      const res = await URLUtils.post('Jobseeker-Save', { form: formData });
      if (res.status === 200) {
        setLoading(false);
        router.replace('/user/login');
        setToastState({ html: 'Account created successfully!', show: true });
      }
    } catch (e) {
      setToastState({ html: e.response?.data?.err || 'some error occurred!', show: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-[450px] rounded-lg border border-[#d1d5db] bg-white px-6 py-10 text-center dark:border-slate-700 dark:bg-slate-900">
      <header className="mb-8">
        <h1 className="mb-1 font-medium text-[#1D1D1D] dark:text-white">Email Verification</h1>
        <p className="text-xs text-[#374151] dark:text-slate-400">Enter the 8-digit verification code that was sent to your email.</p>
      </header>

      <form id="otp-form">
        <div className="my-4 flex items-center justify-center gap-2">
          <input
            type="text"
            maxLength={8}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="block h-11 w-full rounded-md border border-[#889397] px-4 text-xs outline-none transition-[outline] duration-300 focus:outline-2 focus:outline-black dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:outline-sky-500"
          />
        </div>
        {otpErr && <span className="text-xs text-[#dc2626] dark:text-red-400">{otpErr}</span>}
        <div className="mt-4">
          <button
            className="w-full rounded-md bg-[#1D1D1D] py-[10px] text-sm font-medium text-white transition-colors hover:bg-black dark:bg-sky-600 dark:hover:bg-sky-700"
            onClick={submitForm}
          >
            Verify
          </button>
        </div>
      </form>
    </div>
  );
}
