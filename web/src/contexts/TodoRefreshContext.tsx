"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface TodoRefreshContextType {
  refreshTrigger: number;
  triggerRefresh: () => void;
}

const TodoRefreshContext = createContext<TodoRefreshContextType | undefined>(undefined);

export function TodoRefreshProvider({ children }: { children: ReactNode }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = useCallback(() => {
    console.log('🔄 TodoRefreshContext: Triggering todos refresh');
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  return (
    <TodoRefreshContext.Provider value={{ refreshTrigger, triggerRefresh }}>
      {children}
    </TodoRefreshContext.Provider>
  );
}

export function useTodoRefresh() {
  const context = useContext(TodoRefreshContext);
  if (context === undefined) {
    throw new Error('useTodoRefresh must be used within a TodoRefreshProvider');
  }
  return context;
}
