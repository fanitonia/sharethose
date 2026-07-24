import { FileText, Type } from "lucide-react";

import type { DraftValidationErrors } from "@/features/document/types/validation";

interface ValidationErrorGroup {
  key: string;
  icon: typeof Type;
  title: string;
  errors: string[];
}

function getValidationErrorGroups(validationErrors: DraftValidationErrors): ValidationErrorGroup[] {
  const groups: ValidationErrorGroup[] = [];

  if (validationErrors.title) {
    groups.push({
      key: "document",
      icon: Type,
      title: "Document",
      errors: [validationErrors.title],
    });
  }

  if (validationErrors.pages) {
    Object.entries(validationErrors.pages).forEach(([index, pageErrors]) => {
      const pageNumber = Number(index) + 1;
      const errors: string[] = [];

      if (pageErrors.name) {
        errors.push(pageErrors.name);
      }
      if (pageErrors.content) {
        errors.push(pageErrors.content);
      }

      if (errors.length > 0) {
        groups.push({
          key: `page-${index}`,
          icon: FileText,
          title: `Page ${pageNumber}`,
          errors,
        });
      }
    });
  }

  return groups;
}

export type { ValidationErrorGroup };
export { getValidationErrorGroups };
