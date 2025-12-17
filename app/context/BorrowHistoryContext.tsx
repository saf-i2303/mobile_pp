import React, { createContext, useContext, useState } from "react";

type BorrowItem = {
  id: string;
  title: string;
  author: string;
  image: string;
  borrowDate: Date;
  returnDate: Date;
};

type BorrowContextType = {
  history: BorrowItem[];
  addHistory: (item: BorrowItem) => void;
};

const BorrowHistoryContext = createContext<BorrowContextType | undefined>(undefined);

export function BorrowHistoryProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<BorrowItem[]>([]);

  const addHistory = (item: BorrowItem) => {
    setHistory((prev) => [...prev, item]);
  };

  return (
    <BorrowHistoryContext.Provider value={{ history, addHistory }}>
      {children}
    </BorrowHistoryContext.Provider>
  );
}

export const useBorrowHistory = () => {
  const ctx = useContext(BorrowHistoryContext);
  if (!ctx) throw new Error("useBorrowHistory must be used inside provider");
  return ctx;
};
