import { LoadingScreen } from '@/components/LoadingScreen';
import { RealmService } from '@/services/realmService';
import { expensesStore } from '@/stores/expensesStore';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';

export default function Index() {
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    init();
  }, []);

  async function init() {
    await expensesStore.loadExpensesFromStorage();
    const realm = await RealmService.initialize();
    expensesStore.setRealm(realm);
    setInitializing(false);
  };

  if (initializing) {
    return <LoadingScreen />;
  }

  return <Redirect href="/tabs" />;
}
