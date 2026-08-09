import { format, startOfDay } from "date-fns";

import { useId } from "react";

import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DatePickerWithTimeProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  id?: string;
  placeholder?: string;
  disabled?: boolean;
  disablePastDates?: boolean;
}

function DatePickerWithTime({
  value,
  onChange,
  id,
  placeholder = "Pick a date and time",
  disabled = false,
  disablePastDates = false,
}: DatePickerWithTimeProps) {
  const generatedId = useId();
  const timeInputId = `${id ?? generatedId}-time`;

  function handleDateChange(selectedDate: Date | undefined) {
    if (!selectedDate) {
      onChange(undefined);
      return;
    }

    if (value) {
      selectedDate.setHours(value.getHours(), value.getMinutes());
    }

    onChange(selectedDate);
  }

  function handleTimeChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!value) {
      return;
    }

    const [hours, minutes] = event.target.value.split(":");
    const updatedDate = new Date(value);
    updatedDate.setHours(Number.parseInt(hours, 10), Number.parseInt(minutes, 10));
    onChange(updatedDate);
  }

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            className={cn(
              "flex-1 justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
            disabled={disabled}
            id={id}
            variant="outline"
          />
        }
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {value ? format(value, "PPP 'at' HH:mm") : <span>{placeholder}</span>}
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <div className="divide-y overflow-hidden">
          <Calendar
            disabled={disablePastDates ? { before: startOfDay(new Date()) } : undefined}
            mode="single"
            onSelect={handleDateChange}
            selected={value}
          />
          <div className="space-y-1 p-4">
            <Label htmlFor={timeInputId}>Time</Label>
            <div className="flex items-center gap-1">
              <Input
                className="w-full dark:scheme-dark"
                disabled={!value || disabled}
                id={timeInputId}
                onChange={handleTimeChange}
                type="time"
                value={value ? format(value, "HH:mm") : ""}
              />
              {value ? (
                <Button onClick={() => onChange(undefined)} size="sm" variant="ghost">
                  Clear
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export { DatePickerWithTime };
