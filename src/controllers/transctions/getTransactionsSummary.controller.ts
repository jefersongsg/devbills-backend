import type { FastifyReply, FastifyRequest } from "fastify";
import type { GetTransactionsSummaryQuiery } from "../../schemas/transaction.schema";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import prisma from "../../config/prisma";
dayjs.extend(utc);


export const  getTransactionsSummary = async (
    req:FastifyRequest<{Querystring:GetTransactionsSummaryQuiery}>,
    reply:FastifyReply)
    : Promise<void> => {
        const userId = '123456abcde';

        if(!userId){
            reply.status(401).send({
                error: 'User not found'});
                return;
        }
        const {month, year} = req.query;

        if(!month || !year){
            reply.status(400).send({
                error: 'Month and year are required'});
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
                orderBy: { date:'desc' },
                include: {
                    category: true,
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