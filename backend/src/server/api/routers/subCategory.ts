import { labelToSlug, slugToLabel } from "@/lib/helper-functions";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import {
  category,
  insertSubCategory,
  selectSubCategory,
  subCategory,
} from "@/server/db/schema";
import { count, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const revalidatePathString = "/sub-categories";

export const subCategoryRouter = createTRPCRouter({
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

      const filteredSubCategories = await db.query.subCategory.findMany({
        orderBy: desc(category.updatedAt),
        limit: pageSize,
        offset: (page - 1) * pageSize,
      });

      const allSubCategoriesCount = await db
        .select({ count: count() })
        .from(subCategory);

      return {
        status: "success",
        data: filteredSubCategories,
        maxRows: allSubCategoriesCount[0]?.count ?? 0,
        maxPages: allSubCategoriesCount[0]
          ? Math.ceil(allSubCategoriesCount[0]?.count / pageSize)
          : 1,
      };
    }),

  byId: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      try {
        // const subCategorySelected = await db
        //   .select()
        //   .from(subCategory)
        //   .limit(1)
        //   .where(eq(subCategory.id, input.id))
        //   .execute();

        const subCategorySelected = await db.query.subCategory.findFirst({
          where: eq(subCategory.id, input.id),
          columns: {
            categoryId: false,
          },
          with: {
            categoryId: {
              columns: {
                name: true,
                id: true,
              },
            },
          },
        });

        return {
          status: "success",
          data: subCategorySelected,
        };
      } catch (error) {
        return {
          status: "fail",
          message:
            error instanceof Error ? error.message : "Something went wrong",
        };
      }
    }),

  create: publicProcedure
    .input(insertSubCategory)
    .input(
      z.object({
        categoryName: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const categorySelected = await db.query.category.findFirst({
          where: eq(category.name, input.categoryName),
        });

        if (!categorySelected) return { status: "fail" };

        const newSubCategory = await db
          .insert(subCategory)
          .values({
            name: labelToSlug(input.name),
            visibility: input.visibility,
            categoryId: categorySelected.id,
          })
          .returning();

        if (!newSubCategory || newSubCategory.length === 0)
          return {
            status: "fail",
            message: `Could not add the sub category "${input.name}" into the database`,
          };

        revalidatePath(revalidatePathString);

        return {
          status: "success",
          message: `Added new sub category: "${slugToLabel(newSubCategory[0]?.name ?? "")}" into the database`,
        };
      } catch (error) {
        return {
          status: "fail",
          message:
            error instanceof Error ? error.message : "Something went wrong",
        };
      }
    }),

  edit: publicProcedure.input(selectSubCategory).mutation(async ({ input }) => {
    try {
      console.log(input);
      await db
        .update(subCategory)
        .set({
          name: labelToSlug(input.name),
          visibility: input.visibility,
          categoryId: input.categoryId,
        })
        .where(eq(subCategory.id, input.id));

      return {
        status: "success",
        message: `Updated sub category "${slugToLabel(labelToSlug(input?.name) ?? "")}" in the database`,
      };
    } catch (error) {
      return {
        status: "fail",
        message:
          error instanceof Error ? error.message : "Something went wrong",
      };
    }
  }),

  removeAll: publicProcedure
    .input(z.object({ ids: z.number().array() }))
    .mutation(async ({ input }) => {
      try {
        const allSubCategoriesDeleted = input.ids.map(async (id) => {
          return db.delete(subCategory).where(eq(subCategory.id, id));
        });

        await Promise.all(allSubCategoriesDeleted);

        revalidatePath(revalidatePathString);

        return {
          status: "success",
          message: `Removed ${allSubCategoriesDeleted.length} sub category (s) from the database`,
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
        const subCategoryDeletedArr = await db
          .delete(subCategory)
          .where(eq(subCategory.id, input.id))
          .returning();

        const subCategoryDeleted = subCategoryDeletedArr[0];

        if (!subCategoryDeleted)
          return {
            status: "fail",
            message: `Could not remove the sub category with id "${input.id}" from the database`,
          };

        revalidatePath("/categories");

        return {
          status: "success",
          message: `Removed sub category "${slugToLabel(subCategoryDeleted.name)}" from the database`,
        };
      } catch (error) {
        return {
          status: "fail",
          message:
            error instanceof Error ? error.message : "Something went wrong",
        };
      }
    }),
});
