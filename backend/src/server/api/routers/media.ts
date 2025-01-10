import { labelToSlug, slugToLabel } from "@/lib/helper-functions";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import {
  category,
  categoryNameSchema,
  insertCategory,
  selectCategory,
} from "@/server/db/schema";
import { count, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { CategoryMessageBuilder } from "../messages/category";
import { utapi } from "@/server/uploadthing";

export const mediaRouter = createTRPCRouter({
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
      try {
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
      } catch (error) {
        return {
          status: "fail",
          message:
            error instanceof Error
              ? CategoryMessageBuilder(error.message)
              : "Something went wrong",
        };
      }
    }),

  deleteByKey: publicProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ input }) => {
      try {
        await utapi.deleteFiles(input.key);

        revalidatePath("/media");

        return {
          status: "success",
          message: `Removed media from the database`,
        };
      } catch (error) {
        return {
          status: "fail",
          message:
            error instanceof Error
              ? CategoryMessageBuilder(error.message)
              : "Something went wrong",
        };
      }
    }),

  rename: publicProcedure
    .input(z.object({ name: z.string(), key: z.string() }))
    .mutation(async ({ input }) => {
      try {
        await utapi.renameFiles({
          fileKey: input.key,
          newName: labelToSlug(input.name),
        });

        revalidatePath("/media");

        return {
          status: "success",
          message: `Renamed media to "${labelToSlug(input.name)}" in the database`,
        };
      } catch (error) {
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
