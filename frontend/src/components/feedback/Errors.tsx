import { getProblemDetails } from "@/api/problem-details";

type ProblemDetailsErrorProps = {
  error: unknown;
  fallbackMessage?: string;
};

function ProblemDetailsError({
  error,
  fallbackMessage = "Something went wrong.",
}: ProblemDetailsErrorProps) {
  const problemDetails = getProblemDetails(error);

  if (!problemDetails) {
    return <div className="m-4">{fallbackMessage}</div>;
  }

  return (
    <div className="m-4 space-y-2">
      <h1 className="text-lg font-semibold">{problemDetails.title}</h1>
      {problemDetails.detail ? <p>{problemDetails.detail}</p> : null}
      <p className="text-sm text-muted-foreground">
        HTTP {problemDetails.status}
      </p>
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
