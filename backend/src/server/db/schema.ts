// Global Imports
import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgEnum,
  pgTableCreator,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// Local Imports

// Body
// Helper Functions
export const createTable = pgTableCreator((name) => `ecommerce_${name}`);

// Enums
const visibilityObj = pgEnum("text", ["public", "private"]);
const visibilityEnum = visibilityObj("visibility").default("private");

// Tables
export const category = createTable(
  "category",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: varchar("name", { length: 256 }).unique().notNull(),
    visibility: visibilityEnum,
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (obj) => ({
    categoryNameIndex: index("category_name_idx").on(obj.name),
  }),
);

export const subCategory = createTable(
  "sub_category",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: varchar("name", { length: 256 }).unique().notNull(),
    visibility: visibilityEnum,
    categoryId: integer("category_id")
      .references(() => category.id, {
        onUpdate: "restrict",
        onDelete: "restrict",
      })
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (obj) => ({
    subCategoryNameIndex: index("sub_category_name_idx").on(obj.name),
  }),
);

// Relationships
export const categoryRelations = relations(category, ({ many }) => ({
  subCategory: many(subCategory, { relationName: "categorySubCategory" }),
}));

export const subCategoryRelations = relations(subCategory, ({ one }) => ({
  categoryId: one(category, {
    fields: [subCategory.categoryId],
    references: [category.id],
    relationName: "categorySubCategory",
  }),
}));

// Types
export const insertCategory = createInsertSchema(category);
export const selectCategory = createSelectSchema(category);

export const selectVisibilityEnum = createSelectSchema(visibilityObj);

export const insertSubCategory = createInsertSchema(subCategory);
export const selectSubCategory = createSelectSchema(subCategory);