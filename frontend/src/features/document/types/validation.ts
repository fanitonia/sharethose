import type { ValidationErrorGroup } from "@/types/validationErrorGroup";
import { z } from "zod";

import type { DocumentDraft } from "./draft";

const TITLE_MAX_LENGTH = 50;
const PAGE_NAME_MAX_LENGTH = 50;
const PAGE_CONTENT_MAX_LENGTH = 100000;

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
  const errors: ValidationErrorGroup[] = [];

  const titleResult = titleSchema.safeParse(draft.title);
  if (!titleResult.success) {
    errors.push({
      key: "document",
      title: "Document",
      errors: [titleResult.error.issues[0]?.message ?? "Document title is invalid."],
    });
  }

  const seenNames = new Map<string, number>();
  const pageErrors: Record<number, string[]> = {};

  draft.pages.forEach((page, index) => {
    const result = pageSchema.safeParse(page);
    const errorsForPage: string[] = [];

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        if (
          (issue.path[0] === "name" || issue.path[0] === "content") &&
          !errorsForPage.includes(issue.message)
        ) {
          errorsForPage.push(issue.message);
        }
      });
    }

    const normalizedName = page.name.trim().toLowerCase();
    if (normalizedName.length > 0) {
      const existingIndex = seenNames.get(normalizedName);
      if (existingIndex !== undefined) {
        const duplicateError = "Page names must be unique.";
        if (!errorsForPage.includes(duplicateError)) {
          errorsForPage.push(duplicateError);
        }
        const errorsForExistingPage = (pageErrors[existingIndex] ??= []);
        if (!errorsForExistingPage.includes(duplicateError)) {
          errorsForExistingPage.push(duplicateError);
        }
      } else {
        seenNames.set(normalizedName, index);
      }
    }

    if (errorsForPage.length > 0) {
      pageErrors[index] = errorsForPage;
    }
  });

  Object.entries(pageErrors).forEach(([index, pageErrorsForPage]) => {
    errors.push({
      key: `page-${index}`,
      title: `Page ${Number(index) + 1}`,
      errors: pageErrorsForPage,
    });
  });

  return {
    success: errors.length === 0,
    errors,
  };
}

export { TITLE_MAX_LENGTH, PAGE_NAME_MAX_LENGTH, PAGE_CONTENT_MAX_LENGTH, validateDraft };
