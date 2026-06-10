"use client";

import { Menu, MenuHandler, MenuList as MaterialMenuList } from "@material-tailwind/react";
import type { ComponentType, ReactNode } from "react";

type AnyProps = { children?: ReactNode; [key: string]: unknown };
const MenuList = MaterialMenuList as unknown as ComponentType<AnyProps>;
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import Link from 'next/link';
import UserProfileLoginBar from "./UserProfileLoginBar";
import { useAccountsStore } from "../../state/useAccountsStore";
import { useState } from "react";

export default function UserProfileBar () {

  const customer = useAccountsStore((state) => state.customer);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!customer.isAuthenticated) {
    return (
      <Link href="/user/login" className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-slate-950 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0E74BC] dark:text-slate-100 dark:hover:bg-slate-800" aria-label="Login">
        <PersonOutlineOutlinedIcon sx={{ fontSize: 34 }} aria-hidden="true" />
      </Link>
    );
  }

  return (
    <Menu placement="top-start" open={isMenuOpen}
      handler={setIsMenuOpen} offset={{ mainAxis: 20 }} allowHover={true}>
      <MenuHandler>
        <button className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-full text-slate-950 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0E74BC] dark:text-slate-100 dark:hover:bg-slate-800" aria-haspopup="menu" aria-expanded={isMenuOpen} tabIndex={0}>
          <span className="inline-flex size-9 items-center justify-center rounded-full bg-[#0E74BC] text-xs font-bold text-white dark:bg-sky-600">
            {(
              (customer?.firstName?.[0] ?? '') +
              (customer?.lastName?.[0] ?? '')
            ).toUpperCase() || <PersonOutlineOutlinedIcon sx={{ fontSize: 26 }} aria-hidden="true" />
            }
          </span>
        </button>
      </MenuHandler>
      <MenuList className="z-[10060] w-[308px] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
        <UserProfileLoginBar />
      </MenuList>
    </Menu>
  );
}
