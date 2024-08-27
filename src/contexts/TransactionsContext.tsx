import { createContext, ReactNode, useEffect, useState } from "react";

interface Transaction {
  id: number;
  description: string;
  type: 'income' | "outcome";
  price: number;
  category: string;
  createdAt: string;
}

interface TransactionContextType {
  transactions: Transaction[];
  fetchTransactions: (query?: string) => Promise<void>;
}

interface TransactionsProviderProps {
  children: ReactNode;
}

export const TransactionsContext = createContext({} as TransactionContextType)

export function TransactionsProvider({children}: TransactionsProviderProps) {

  const [transactions, setTransactions] = useState<Transaction[]>([])

  async function fetchTransactions(query?: string) {
    const url = new URL('http://localhost:3333/transactions');

    const response = await fetch(url)

    // Atualizei toda esta parte
    if(query) {     
  
      const data: Transaction[] = await response.json()

      const filterData = data.filter((obj) => 
        Object.values(obj).some((objValue) => 
          objValue.toString().toLowerCase().includes(query.toLowerCase())
        )
      )

      setTransactions(filterData)

    } else {
      const data: Transaction[] = await response.json()

      setTransactions(data)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  return (
    <TransactionsContext.Provider value={{ transactions, fetchTransactions,}}>
      {children}
    </TransactionsContext.Provider>
  )
}