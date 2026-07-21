import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { CircleAlert } from "lucide-react";

interface NotFoundProps {
  title?: string;
  description?: string;
  content?: React.ReactNode;
  className?: string;
}

function NotFound({ title, description, content, className }: NotFoundProps) {
  return (
    <Empty className={className}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CircleAlert />
        </EmptyMedia>
        <EmptyTitle>{title ?? "404 - Not Found"}</EmptyTitle>
        <EmptyDescription>
          {description ?? "We couldn't find the page you're looking for."}
        </EmptyDescription>
      </EmptyHeader>
      {content && <EmptyContent>{content}</EmptyContent>}
    </Empty>
  );
}

export { NotFound };
