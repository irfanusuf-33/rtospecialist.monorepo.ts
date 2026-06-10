"use client";

import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import InboxIcon from '@mui/icons-material/Inbox';
import SupportIcon from '@mui/icons-material/Support';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAccountsStore } from '../../state/useAccountsStore';
import { usePageLoaderStore } from '../../state/usePageLoaderStore';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SearchIcon from '@mui/icons-material/Search';
import AddCardIcon from '@mui/icons-material/AddCard';
import URLUtils from "../../scripts/UrlUtils";

export default function UserProfileLoginBar () {

  const { customer, setCustomer } = useAccountsStore();
  const setLoading = usePageLoaderStore((state) => state.setLoading);
  const router = useRouter();

  const signOut = async () => {
    try {
      setLoading(true);
      const res = await URLUtils.post('Account-Logout');
      if (res.status === 200) {
        setCustomer({});
      }
    }
    catch {
      setCustomer({});
    } finally {
      setLoading(false);
      router.replace('/user/login');
    }
  };

  return (
    <div>
      <button className="w-full">
        <div className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50">
          <EmailIcon sx={{ fontSize: 20 }} /> <span className='font-medium text-sm'>{customer.email}</span>
        </div>
      </button>
      <div className='h-[1px] bg-gray-200'></div>
      <Link href="/accounts/settings">
        <div className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50">
          <DashboardIcon sx={{ fontSize: 20 }} /> <span className='text-sm'>Dashboard</span>
        </div>
      </Link>
      {
        customer.accountType === 'JOBSEEKER' && (
      <Link href="/jobseeker/dashboard">
        <div className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50">
          <PersonIcon sx={{ fontSize: 20 }} /> <span className='text-sm'>Profile</span>
        </div>
        </Link>
        )
      }
      {
        customer.accountType === 'GENERAL' && (
          <>
          <Link href="/general/explore-profiles">
            <div className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50">
              <SearchIcon sx={{ fontSize: 20 }} /> <span className='text-sm'>Recruitments</span>
            </div>
          </Link>
          <button onClick={() => undefined} className="w-full">
            <div className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50">
              <AddCardIcon sx={{ fontSize: 20 }} /> <span className='text-sm'>Invoice Payments</span>
            </div>
          </button>
          </>
        )
      }
      {
        (customer.accountType === "GENERAL" || customer.accountType === "PDEV_USER") && (
          <Link href="/development-courses">
            <div className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50">
              <PersonIcon sx={{ fontSize: 20 }} /> <span className='text-sm'>Development Courses</span>
            </div>
          </Link>
        )
      }
      <Link href="/accounts/inbox">
        <div className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50">
          <InboxIcon sx={{ fontSize: 20 }} /> <span className='text-sm'>Inbox</span>
        </div>
      </Link>
      <Link href="/help">
        <div className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50">
          <SupportIcon sx={{ fontSize: 20 }} /> <span className='text-sm'>Get Help</span>
        </div>
      </Link>
      <div className='h-[1px] bg-gray-200'></div>
      <button onClick={signOut} className="w-full">
        <div className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50">
          <PowerSettingsNewIcon sx={{ fontSize: 20, color: '#dc2626' }} /> <span className='text-sm text-red-600'>Sign Out</span>
        </div>
      </button>
    </div>
  );
}
