import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

type PageTitleContextValue = {
  title: string;
  setTitle: (title: string) => void;
};

const PageTitleContext = createContext<PageTitleContextValue | null>(null);

export function PageTitleProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState('');

  const value = useMemo(() => ({ title, setTitle }), [title]);

  return (
    <PageTitleContext.Provider value={value}>
      {children}
    </PageTitleContext.Provider>
  );
}

export function usePageTitle(title: string) {
  const context = useContext(PageTitleContext);
  if (!context) {
    throw new Error('usePageTitle must be used within PageTitleProvider');
  }

  useEffect(() => {
    context.setTitle(title);
  }, [context, title]);

  return context;
}

export function usePageTitleValue() {
  const context = useContext(PageTitleContext);
  if (!context) {
    throw new Error('usePageTitleValue must be used within PageTitleProvider');
  }
  return context.title;
}
