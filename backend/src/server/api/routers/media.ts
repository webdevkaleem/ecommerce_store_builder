import { labelToSlug } from "@/lib/helper-functions";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { category, media } from "@/server/db/schema";
import { utapi } from "@/server/uploadthing";
import { count, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { CategoryMessageBuilder } from "../messages/category";

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

  deleteMany: publicProcedure
    .input(z.object({ keys: z.string().array() }))
    .mutation(async ({ input }) => {
      try {
        await utapi.deleteFiles(input.keys);

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
    .input(z.object({ name: z.string(), id: z.number() }))
    .mutation(async ({ input }) => {
      try {
        await db
          .update(media)
          .set({ name: labelToSlug(input.name) })
          .where(eq(media.id, input.id));

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

  create: publicProcedure
    .input(z.object({ name: z.string(), keys: z.string().array() }))
    .mutation(async ({ input }) => {
      try {
        await db.insert(media).values({
          name: labelToSlug(input.name),
          sources: input.keys,
          type: "image",
        });

        revalidatePath("/media");

        return {
          status: "success",
          message: `Created media "${labelToSlug(input.name)}" and all of it's varients in the database`,
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
