import { z } from "zod";
import { ObjectId } from "mongodb";
import { TransactionType } from "@prisma/client";

const isValidObjectId = (id: string): boolean => {
    return ObjectId.isValid(id);
};

export const createTransactionSchema = z.object({
        amount: z.number().positive("valor deve ser positivo"),
        categoryId: z.string().refine(isValidObjectId, {
            message:  "categoria invalida" 
        }),
        description: z.string().min(1, "descrição obrigatoria"),
        date: z.coerce.date({
            errorMap: () => ({ message: "data invalida" }),
        }),
        type: z.enum([TransactionType.income, TransactionType.expense],{
            errorMap: () => ({ message: "tipo invalido" }),
        }),  
});

export const getTransactionSchema = z.object({
        month: z.string()
        .regex(/^(0[1-9]|1[0-2])$/, "O mês deve estar no formato de 01 a 12")
        .optional(),
        year: z.string()
        .regex(/^\d{4}$/, "O ano deve estar no formato YYYY")
        .refine(
        (ano) => ano ? Number(ano) >= 2000 : true,
        "O ano deve ser 2000 ou posterior"
        ).optional(),
        type: z.enum([TransactionType.income, TransactionType.expense],{
            errorMap: () => ({ message: "tipo invalido" }),
        }).optional(),
        categoryId: z.string().refine(isValidObjectId, {
            message:  "categoria invalida" 
        }).optional(),
});

export const getTransactionSummarySchema = z.object({
    month: z.string({message:'O mês é obrigatório'})
    .regex(/^(0[1-9]|1[0-2])$/),

    year: z.string({message:'O ano é obrigatório'})
    .regex(/^\d{4}$/)
    .refine(
    (ano) => ano ? Number(ano) >= 2000 : true,
    ),
});

export const deleteTransactionSchema = z.object({
    id: z.string().refine(isValidObjectId, {
        message:  "id invalido"
    }),
});

export type CreateTransactionBody = z.infer<typeof createTransactionSchema>;
export type GetTransactionsQuiery = z.infer<typeof getTransactionSchema>;
export type GetTransactionsSummaryQuiery = z.infer<typeof getTransactionSummarySchema>;
export type deleteTransactionParams = z.infer<typeof deleteTransactionSchema>;