import { LoadingScreen } from '@/components/LoadingScreen';
import { expensesStore } from '@/stores/expensesStore';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';

export default function Index() {
  const [initializing, setInitializing] = useState(true);

  async function init() {
    await expensesStore.loadExpensesFromStorage();
    setInitializing(false);
  };

  useEffect(() => {
    init();
  }, []);

  if(initializing) {
    return <LoadingScreen/>;
  }

  return <Redirect href="/tabs" />;
}
