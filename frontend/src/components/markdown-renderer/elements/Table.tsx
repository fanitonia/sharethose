import { cn } from "@lib/utils";

function Table({
  children,
  className,
  ...rest
}: React.ComponentPropsWithoutRef<"table">) {
  return (
    <div className="my-4 w-full overflow-x-auto">
      <table
        className={cn(
          "w-full min-w-max border-collapse border-2 text-sm",
          className
        )}
        {...rest}
      >
        {children}
      </table>
    </div>
  );
}

function TableHead({
  children,
  className,
  ...rest
}: React.ComponentPropsWithoutRef<"thead">) {
  return (
    <thead className={cn(className)} {...rest}>
      {children}
    </thead>
  );
}

function TableBody({
  children,
  className,
  ...rest
}: React.ComponentPropsWithoutRef<"tbody">) {
  return (
    <tbody
      className={cn("[&>tr:nth-child(odd)]:bg-muted/50", className)}
      {...rest}
    >
      {children}
    </tbody>
  );
}

function TableRow({
  children,
  className,
  ...rest
}: React.ComponentPropsWithoutRef<"tr">) {
  return (
    <tr className={cn("transition-colors", className)} {...rest}>
      {children}
    </tr>
  );
}

function TableHeaderCell({
  children,
  className,
  ...rest
}: React.ComponentPropsWithoutRef<"th">) {
  return (
    <th
      className={cn(
        "border-2 px-4 py-3 text-left align-middle font-bold text-foreground",
        className
      )}
      {...rest}
    >
      {children}
    </th>
  );
}

function TableCell({
  children,
  className,
  ...rest
}: React.ComponentPropsWithoutRef<"td">) {
  return (
    <td
      className={cn(
        "border-2 px-4 py-3 align-middle text-foreground",
        className
      )}
      {...rest}
    >
      {children}
    </td>
  );
}

export { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow };
