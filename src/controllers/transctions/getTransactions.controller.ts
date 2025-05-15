import type { FastifyRequest, FastifyReply} from "fastify";
import type { GetTransactionsQuiery } from "../../schemas/transaction.schema";
import type { TransactionFilter } from "../../types/transactions.type";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import prisma from "../../config/prisma";
dayjs.extend(utc);

export const getTransactions = async (
    req:FastifyRequest<{Querystring: GetTransactionsQuiery}>, 
    reply: FastifyReply)
    : Promise<void> => {
        const userId = '123456abcde';

        if(!userId){
            reply.status(401).send({
                error: 'User not found'});
                return;
        }
        const {categoryId, month, type, year} = req.query;

        const filters: TransactionFilter= { userId,};

        if (month && year ){
            const startDate = dayjs.utc(`${year}-${month}-01`).startOf('month').toDate();
            const endDate = dayjs.utc(startDate).endOf('month').toDate();
            filters.date = { gte: startDate, lte: endDate };
        }
        if(categoryId){
            filters.categoryId = categoryId;
        }
        if(type){
            filters.type = type;
        }
        try {
            const transactions = await prisma.transaction.findMany({
                where: filters,
                orderBy: { date:'desc' },
                include: {
                    category: {
                    select: {color:true, name:true, type:true},
                    },
                },
            });
            reply.status(200).send(transactions);
            
        } catch (error) {
            req.log.error('Error while fetching transactions', error);
            reply.status(500).send({
                error: 'Internal server error',
            });      
        }
    };