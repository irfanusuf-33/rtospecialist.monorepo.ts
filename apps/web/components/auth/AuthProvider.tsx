'use client';

import { useEffect, useState } from 'react';
import { useAccountsStore } from '@/state/useAccountsStore';
import { useCartStore } from '@/state/useCartStore';
import { useGuestCartStore } from '@/state/useGuestCartStore';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(
    () =>
      useAccountsStore?.persist?.hasHydrated() &&
      useCartStore.persist?.hasHydrated() &&
      useGuestCartStore.persist?.hasHydrated()
  );

  useEffect(() => {
    let hydratedStores = 0;
    const markHydrated = () => {
      hydratedStores += 1;
      if (hydratedStores === 3) {

        setIsHydrated(true);
      }
    };

    const unsubscribeAccounts = useAccountsStore.persist.onFinishHydration(markHydrated);
    const unsubscribeCart = useCartStore.persist.onFinishHydration(markHydrated);
    const unsubscribeGuestCart = useGuestCartStore.persist.onFinishHydration(markHydrated);

    useAccountsStore.persist.rehydrate();
    useCartStore.persist.rehydrate();
    useGuestCartStore.persist.rehydrate();

    return () => {
      unsubscribeAccounts();
      unsubscribeCart();
      unsubscribeGuestCart();
    };
  }, []);

  if (!isHydrated) return null;

  return <>{children}</>;
}
