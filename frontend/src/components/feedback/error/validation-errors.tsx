import type { ValidationErrorGroup } from "@/types/validationErrorGroup";

import { FileText, Type } from "lucide-react";

import { Container } from "@/components/ui/container";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ValidationErrorsProps {
  validationErrors: ValidationErrorGroup[];
}

function ValidationErrors({ validationErrors }: ValidationErrorsProps) {
  return (
    <Container variant="destructive">
      <ScrollArea>
        <div className="max-h-96 space-y-3">
          {validationErrors.map((group) => (
            <div key={group.key} className="flex flex-col gap-1.5">
              <p className="flex items-center gap-1.5 font-medium">
                {group.title.toLowerCase().includes("document") ? (
                  <Type className="size-3.5" />
                ) : group.title.toLowerCase().includes("page") ? (
                  <FileText className="size-3.5" />
                ) : null}
                {group.title}
              </p>
              <ul className="list-disc pl-8 text-foreground">
                {group.errors.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Container>
  );
}

export { ValidationErrors };
