import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

interface CopyLinkInputProps {
  value: string;
  onCopy?: () => void;
  className?: string;
  hideValue?: boolean;
}

const CopyLinkInput = ({ value, onCopy, className, hideValue }: CopyLinkInputProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      onCopy?.();
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // TODO: handle error and show a toast notification
    }
  };

  return (
    <InputGroup className={`w-full max-w-md ${className ?? ""}`}>
      <InputGroupInput
        placeholder="https://example.com"
        readOnly
        value={value}
        type={hideValue ? "password" : "text"}
      />
      <InputGroupAddon align="inline-end">
        <InputGroupButton aria-label="Copy" onClick={handleCopy} size="icon-xs">
          {copied ? <CheckIcon /> : <CopyIcon />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
};

export { CopyLinkInput };
