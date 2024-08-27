import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../lib/axios";

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
    const response =  await api.get('transactions')

    const data = response.data as Transaction[]

    // Atualizei toda esta parte em relação ao original
    if(query) {     

      const filterData = data.filter((obj) => 
        Object.values(obj).some((objValue) => 
          objValue.toString().toLowerCase().includes(query.toLowerCase())
        )
      )

      setTransactions(filterData)

    } else {
      

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