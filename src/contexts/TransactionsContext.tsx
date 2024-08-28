import { ReactNode, useEffect, useState, useCallback } from "react";
import { api } from "../lib/axios";
import { createContext } from "use-context-selector";

interface Transaction {
  id: number;
  description: string;
  type: 'income' | "outcome";
  price: number;
  category: string;
  createdAt: string;
}

interface CreateTansactionInput {
  description: string;
  price: number;
  category: string;
  type: 'income' | 'outcome';
}

interface TransactionContextType {
  transactions: Transaction[];
  fetchTransactions: (query?: string) => Promise<void>;
  createTransaction: (data: CreateTansactionInput) => Promise<void>;
}

interface TransactionsProviderProps {
  children: ReactNode;
}

export const TransactionsContext = createContext({} as TransactionContextType)

export function TransactionsProvider({children}: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  const fetchTransactions = useCallback( async(query?: string) => {
    const response =  await api.get<Transaction[]>('transactions', { params: { 
      // Não funciona com minha versão do json server
      _sort: 'createdAt',
      _order: 'desc' ,
      q: query,
    }})
  
    const data = response.data

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
  }, [])

  const createTransaction = useCallback(
    async (data: CreateTansactionInput ) => {
      const {description, price, category, type } = data
  
      const response = await api.post('transactions', {
        description,
        price,
        category,
        type,
        createdAt: new Date()
      })
  
      setTransactions(state => [response.data, ...state])
  
    }, []
  )

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  return (
    <TransactionsContext.Provider value={{ transactions, fetchTransactions, createTransaction,}}>
      {children}
    </TransactionsContext.Provider>
  )
}