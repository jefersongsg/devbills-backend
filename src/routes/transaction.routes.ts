import { FastifyInstance } from "fastify";
import createTransaction from "../controllers/transctions/createTransaction.controller";
import {zodToJsonSchema} from "zod-to-json-schema";
import { createTransactionSchema, getTransactionSchema, getTransactionSummarySchema } from "../schemas/transaction.schema";
import { getTransactions } from "../controllers/transctions/getTransactions.controller";
import { getTransactionsSummary } from "../controllers/transctions/getTransactionsSummary.controller";


const transactionRoutes = async (fastify: FastifyInstance): Promise<void> => {
  fastify.route({
    method: "POST",
    url: "/",
    schema:{
        body: zodToJsonSchema(createTransactionSchema),
    },
    handler: createTransaction,
  });

  fastify.route({
    method: "GET",
    url: "/",
    schema:{
        querystring: zodToJsonSchema(getTransactionSchema),
    },
    handler: getTransactions,
  });

  fastify.route({
    method: "GET",
    url: "/summary",
    schema:{
        querystring: zodToJsonSchema(getTransactionSummarySchema),
    },
    handler: getTransactionsSummary,
  });

};


export default transactionRoutes;