import { z } from "zod";

import type { DocumentDraft } from "./draft";

const TITLE_MAX_LENGTH = 50;
const PAGE_NAME_MAX_LENGTH = 50;
const PAGE_CONTENT_MAX_LENGTH = 100000;

type DraftPageValidationErrors = {
  name?: string;
  content?: string;
};

type DraftValidationErrors = {
  title?: string;
  pages?: Record<number, DraftPageValidationErrors>;
};

const titleSchema = z
  .string()
  .transform((value) => value.trim())
  .refine((value) => value.length > 0, "Document title is required.")
  .refine(
    (value) => value.length <= TITLE_MAX_LENGTH,
    "Document title must be 50 characters or less."
  );

const pageSchema = z.object({
  name: z
    .string()
    .transform((value) => value.trim())
    .refine((value) => value.length > 0, "Page name is required.")
    .refine(
      (value) => value.length <= PAGE_NAME_MAX_LENGTH,
      "Page name must be 50 characters or less."
    ),
  content: z
    .string()
    .transform((value) => value.trim())
    .refine((value) => value.length > 0, "Page content is required.")
    .refine(
      (value) => value.length <= PAGE_CONTENT_MAX_LENGTH,
      "Page content must be 100000 characters or less."
    ),
});

function validateDraft(draft: DocumentDraft) {
  const errors: DraftValidationErrors = {};

  const titleResult = titleSchema.safeParse(draft.title);
  if (!titleResult.success) {
    errors.title = titleResult.error.issues[0]?.message ?? "Document title is invalid.";
  }

  const seenNames = new Map<string, number>();
  const pageErrors: Record<number, DraftPageValidationErrors> = {};

  draft.pages.forEach((page, index) => {
    const result = pageSchema.safeParse(page);
    const issues: DraftPageValidationErrors = {};

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        if (issue.path[0] === "name" && !issues.name) {
          issues.name = issue.message;
        }
        if (issue.path[0] === "content" && !issues.content) {
          issues.content = issue.message;
        }
      });
    }

    const normalizedName = page.name.trim().toLowerCase();
    if (normalizedName.length > 0) {
      const existingIndex = seenNames.get(normalizedName);
      if (existingIndex !== undefined) {
        issues.name = "Page names must be unique.";
        if (!pageErrors[existingIndex]?.name) {
          pageErrors[existingIndex] = {
            ...pageErrors[existingIndex],
            name: "Page names must be unique.",
          };
        }
      } else {
        seenNames.set(normalizedName, index);
      }
    }

    if (issues.name || issues.content) {
      pageErrors[index] = { ...pageErrors[index], ...issues };
    }
  });

  if (Object.keys(pageErrors).length > 0) {
    errors.pages = pageErrors;
  }

  return {
    success: !errors.title && !errors.pages,
    errors,
  };
}

export type { DraftPageValidationErrors, DraftValidationErrors };
export { TITLE_MAX_LENGTH, PAGE_NAME_MAX_LENGTH, PAGE_CONTENT_MAX_LENGTH, validateDraft };
