import { TransactionType } from "@prisma/client";
import { CategorySummary } from "./category.types";


export interface TransactionFilter {
    userId: string;
    date?: {  gte:Date;  lte:Date;};
    categoryId?: string;
    type?: TransactionType;
}

export interface TransactionSummary {
    totalExpenses: number;
    totalIncomes: number;
    balance: number;
    expressByCategory: CategorySummary[];
   
}