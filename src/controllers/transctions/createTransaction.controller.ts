import type { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../config/prisma";
import { type CreateTransactionBody, createTransactionSchema } from "../../schemas/transaction.schema";


const createTransaction = async (
    req: FastifyRequest<{ Body: CreateTransactionBody }>,
    reply: FastifyReply)
    : Promise<void> => {

    const userId = '123456abcde';
    if (!userId) {
        reply.status(401).send({
            error: 'User not found'
        });
        return;
    }

    const result = createTransactionSchema.safeParse(req.body);
    if (!result.success) {
        const errorMessage = result.error.errors[0].message || 'invalid validation';

        reply.status(400).send({
            error: errorMessage,
        });
        return;
    }

    const transaction = result.data;
    try {
        const category = await prisma.category.findFirst({
            where: {
                id: transaction.categoryId,
                type: transaction.type,
            },
        });
        if (!category) {
            reply.status(400).send({
                error: 'Category not found',
            });
            return;
        }

        const parsedDate = new Date(transaction.date);

        const newTransaction = await prisma.transaction.create({
            data: {
                ...transaction,
                userId,
                date: parsedDate,
            },
            include: {
                category: true,
            },
        });
        reply.status(201).send(newTransaction);
    }
    catch (err) {
        req.log.error('Error ao criar transaçao', err);
        reply.status(500).send({ error: 'Internal server error' });
        console.log(err)
    }
}; export default createTransaction;