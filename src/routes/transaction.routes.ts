import type { FastifyInstance } from "fastify";
import { zodToJsonSchema } from "zod-to-json-schema";
import createTransaction from "../controllers/transctions/createTransaction.controller";
import { deleteTransactions } from "../controllers/transctions/deletTransaction.controller";
import { getTransactions } from "../controllers/transctions/getTransactions.controller";
import { getTransactionsSummary } from "../controllers/transctions/getTransactionsSummary.controller";
import { createTransactionSchema, deleteTransactionSchema, getTransactionSchema, getTransactionSummarySchema } from "../schemas/transaction.schema";


const transactionRoutes = async (fastify: FastifyInstance): Promise<void> => {
  fastify.route({
    method: "POST",
    url: "/",
    schema: {
      body: zodToJsonSchema(createTransactionSchema),
    },
    handler: createTransaction,
  });

  fastify.route({
    method: "GET",
    url: "/",
    schema: {
      querystring: zodToJsonSchema(getTransactionSchema),
    },
    handler: getTransactions,
  });

  fastify.route({
    method: "GET",
    url: "/summary",
    schema: {
      querystring: zodToJsonSchema(getTransactionSummarySchema),
    },
    handler: getTransactionsSummary,
  });

  fastify.route({
    method: "DELETE",
    url: "/:id",
    schema: {
      params: zodToJsonSchema(deleteTransactionSchema),
    },
    handler: deleteTransactions,
  });

};


export default transactionRoutes;