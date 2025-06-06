import { type Category, TransactionType } from "@prisma/client";
import prisma from "../config/prisma";

type GlobalCategoryInput = Pick<Category, "name" | "color" | "type">;

const globalCategories: GlobalCategoryInput[] = [
    //Despenses 
    { name: "Alimentação", color: "#ff5733", type: TransactionType.expense, },
    { name: "Saúde", color: "#33a8ff", type: TransactionType.expense, },
    { name: "Moradia", color: "#33ff57", type: TransactionType.expense, },
    { name: "Transporte", color: "#f033ff", type: TransactionType.expense, },
    { name: "Educação", color: "#ff3366", type: TransactionType.expense, },
    { name: "Lazer", color: "#ffba33", type: TransactionType.expense, },
    { name: "Compras", color: "#33fff6", type: TransactionType.expense, },
    { name: "Outros", color: "#b033ff", type: TransactionType.expense, },
    //Receitas
    { name: "Salario", color: "#33ff57", type: TransactionType.income, },
    { name: "Investimentos", color: "#ff3366", type: TransactionType.income, },
    { name: "Freelance", color: "#ffba33", type: TransactionType.income, },
    { name: "Outros", color: "#33fff6", type: TransactionType.income, },
];

export const initializeGlobalCategories = async (): Promise<Category[]> => {
    const createdCategories: Category[] = [];

    for (const category of globalCategories) {
        try {
            const existingCategory = await prisma.category.findFirst({
                where: {
                    name: category.name,
                    type: category.type
                },
            });

            if (!existingCategory) {
                const newCategory = await prisma.category.create({ data: category });
                createdCategories.push(newCategory);
            } else {
                createdCategories.push(existingCategory);
            }
        } catch (err) {
            console.log("Error creating category");
        }
    }
    return createdCategories;
};