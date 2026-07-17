import { useRef, useState } from "react";

function useInlineEdit(onCommit: (value: string) => void) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");
  const hasCommitted = useRef(false);

  function start(initialValue: string) {
    hasCommitted.current = false;
    setValue(initialValue);
    setEditing(true);
  }

  function commit() {
    if (!editing || hasCommitted.current) {
      return;
    }

    hasCommitted.current = true;
    onCommit(value.trim());
    setEditing(false);
  }

  function cancel() {
    hasCommitted.current = true;
    setEditing(false);
  }

  return {
    editing,
    value,
    setValue,
    start,
    commit,
    cancel,
  };
}

export { useInlineEdit };
