import { toast } from "sonner";

import { useState } from "react";

import { CheckIcon, CopyIcon } from "lucide-react";

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
      onCopy?.();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy to clipboard");
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
