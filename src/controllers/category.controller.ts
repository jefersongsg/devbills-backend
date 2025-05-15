import type { FastifyReply,FastifyRequest } from "fastify";
import prisma from "../config/prisma";


export const getCategories = async (
    req:FastifyRequest,
    reply:FastifyReply): Promise<void> => {
    try {
        const categories = await prisma.category.findMany({
            orderBy: {
                name: "asc" },
        });

        reply.send(categories);
    } catch (error) {
        req.log.error("Erro ao buscar caregories", error);
        reply.status(500).send({ error: "Erro ao buscar caregorias" });
    }
};