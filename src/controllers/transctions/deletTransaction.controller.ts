import type { FastifyReply, FastifyRequest } from "fastify";
import { deleteTransactionParams } from "../../schemas/transaction.schema";
import prisma from "../../config/prisma";


export const deleteTransactions = async (
    req: FastifyRequest<{ Params: deleteTransactionParams }>,
    reply: FastifyReply)
    : Promise<void> => {
    const userId = '123456abcde';
    const { id } = req.params;

    if (!userId) {
        reply.status(401).send({
            error: 'User not found'
        });
        return;
    }

    try {

        const transaction = await prisma.transaction.findFirst({
            where: {
                id,
                userId,
            },
        });
        if (!transaction) {
            reply.status(404).send({
                error: 'Transaction not found'
            });
            return;
        }
        await prisma.transaction.delete({
            where: { id }
        });
        reply.status(200).send({ message: 'Transaction deleted successfully' });
    } catch (error) {
        req.log.error({ message: 'Transaction not found' });
        reply.status(500).send({
            error: 'Internal server error'
        });
        return;

    }
};