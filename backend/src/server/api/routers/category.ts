import { labelToSlug, slugToLabel } from "@/lib/helper-functions";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { category, insertCategory } from "@/server/db/schema";
import { count, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { CategoryMessageBuilder } from "../messages/category";

export const categoryRouter = createTRPCRouter({
  all: publicProcedure
    .input(
      z.object({
        page: z.string().array().or(z.string()),
        pageSize: z.string().array().or(z.string()),
        sortBy: z.string().array().or(z.string()),
        sortOrder: z.string().array().or(z.string()),
      }),
    )
    .query(async ({ input }) => {
      const page = Array.isArray(input.page)
        ? Number(input.page[0])
        : Number(input.page);
      const pageSize = Array.isArray(input.pageSize)
        ? Number(input.pageSize[0])
        : Number(input.pageSize);

      const filteredCategories = await db.query.category.findMany({
        orderBy: desc(category.updatedAt),
        limit: pageSize,
        offset: (page - 1) * pageSize,
      });

      const allCategoriesCount = await db
        .select({ count: count() })
        .from(category);

      return {
        status: "success",
        data: filteredCategories,
        maxRows: allCategoriesCount[0]?.count ?? 0,
        maxPages: allCategoriesCount[0]
          ? Math.ceil(allCategoriesCount[0]?.count / pageSize)
          : 1,
      };
    }),

  byId: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const categorySelected = await db
        .select()
        .from(category)
        .limit(1)
        .where(eq(category.id, input.id))
        .execute();

      return {
        status: "success",
        data: categorySelected[0],
      };
    }),

  create: publicProcedure.input(insertCategory).mutation(async ({ input }) => {
    try {
      const newCategory = await db
        .insert(category)
        .values({
          name: labelToSlug(input.name),
          visibility: input.visibility,
        })
        .returning();

      revalidatePath("/categories");

      return {
        status: "success",
        message: `Added new category: "${slugToLabel(newCategory[0]?.name ?? "")}" into the database`,
      };
    } catch (error) {
      // Optional error handling
      // If the error is an instance of Error, then we can use the CategoryMessageBuilder function to handle the error message
      // Otherwise, we can use the default error message
      return {
        status: "fail",
        message:
          error instanceof Error
            ? CategoryMessageBuilder(error.message)
            : "Something went wrong",
      };
    }
  }),

  removeAll: publicProcedure
    .input(z.object({ ids: z.number().array() }))
    .mutation(async ({ input }) => {
      try {
        const allCategoriesDeleted = input.ids.map(async (id) => {
          return db.delete(category).where(eq(category.id, id));
        });

        await Promise.all(allCategoriesDeleted);

        revalidatePath("/categories");

        return {
          status: "success",
          message: `Removed ${allCategoriesDeleted.length} category (s) from the database`,
        };
      } catch (error) {
        return {
          status: "fail",
          message:
            error instanceof Error ? error.message : "Something went wrong",
        };
      }
    }),

  removeById: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      try {
        const categoryDeletedArr = await db
          .delete(category)
          .where(eq(category.id, input.id))
          .returning();

        const categoryName = categoryDeletedArr[0]?.name;

        if (!categoryName) throw new Error();

        revalidatePath("/categories");

        return {
          status: "success",
          message: `Removed category "${slugToLabel(categoryName)}" from the database`,
        };
      } catch (error) {
        // Optional error handling
        // If the error is an instance of Error, then we can use the CategoryMessageBuilder function to handle the error message
        // Otherwise, we can use the default error message
        return {
          status: "fail",
          message:
            error instanceof Error
              ? CategoryMessageBuilder(error.message)
              : "Something went wrong",
        };
      }
    }),
});