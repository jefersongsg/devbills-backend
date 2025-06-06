import { TransactionType } from "@prisma/client";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import type { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../config/prisma";
import type { GetTransactionsSummaryQuiery } from "../../schemas/transaction.schema";
import type { CategorySummary } from "../../types/category.types";
import type { TransactionSummary } from "../../types/transactions.type";


dayjs.extend(utc);


export const getTransactionsSummary = async (
    req: FastifyRequest<{ Querystring: GetTransactionsSummaryQuiery }>,
    reply: FastifyReply)
    : Promise<void> => {
    const userId = '123456abcde';

    if (!userId) {
        reply.status(401).send({
            error: 'User not found'
        });
        return;
    }
    const { month, year } = req.query;

    if (!month || !year) {
        reply.status(400).send({
            error: 'Month and year are required'
        });
        return;
    }

    const startDate = dayjs.utc(`${year}-${month}-01`).startOf('month').toDate();
    const endDate = dayjs.utc(startDate).endOf('month').toDate();

    try {
        const transactions = await prisma.transaction.findMany({
            where: {
                userId,
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            orderBy: { date: 'desc' },
            include: {
                category: true,
            },
        });

        let totalIncomes = 0;
        let totalExpenses = 0;
        const groupeExpenses = new Map<string, CategorySummary>();

        for (const transaction of transactions) {

            if (transaction.type === TransactionType.expense) {

                const existing = groupeExpenses.get(transaction.categoryId) ?? {
                    categoryId: transaction.categoryId,
                    categoryName: transaction.category.name,
                    categoryColor: transaction.category.color,
                    amount: 0,
                    percentage: 0,
                };

                existing.amount += transaction.amount;
                groupeExpenses.set(transaction.categoryId, existing);

                totalExpenses += transaction.amount;
            } else {
                totalIncomes += transaction.amount;

            }
        }

        const summary: TransactionSummary = {
            totalIncomes,
            totalExpenses,
            balance: Number((totalIncomes - totalExpenses).toFixed(2)),
            expensesByCategory: Array.from(groupeExpenses.values()).map((entry) => ({
                ...entry,
                percentage: Number.parseFloat(((entry.amount / totalExpenses) * 100).toFixed(2)),
            })).sort((a, b) => b.amount - a.amount),
        };

        reply.status(200).send(summary);

    } catch (error) {
        req.log.error('Error while fetching transactions', error);
        reply.status(500).send({ error: 'Internal server error' });
    }
};