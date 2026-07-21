import { cn } from "@/lib/utils";
import { getProblemDetails } from "@/utilities/getProblemDetails";

type ProblemDetailsErrorProps = {
  error: unknown;
  fallbackMessage?: string;
  className?: string;
};

// TODO: improve ProblemDetailsError
function ProblemDetailsError({
  error,
  fallbackMessage = "Something went wrong.",
  className,
}: ProblemDetailsErrorProps) {
  const problemDetails = getProblemDetails(error);

  if (!problemDetails) {
    return <div className={cn(className)}>{fallbackMessage}</div>;
  }

  return (
    <div className={cn("space-y-2", className)}>
      <h1 className="text-base font-semibold">{problemDetails.title}</h1>
      {problemDetails.detail ? <p>{problemDetails.detail}</p> : null}
      <p className="text-sm text-muted-foreground">HTTP {problemDetails.status}</p>
      {problemDetails.errors ? (
        <ul className="list-disc pl-5 text-sm text-muted-foreground">
          {Object.entries(problemDetails.errors).map(([field, messages]) => (
            <li key={field}>
              {field}: {messages.join(", ")}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export { ProblemDetailsError };
