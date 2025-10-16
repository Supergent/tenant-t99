"use client";

import { useToast } from "@jn76g7re6eaetkbr28pxzdp73x7sk4zg/components";

export function useDemoToast() {
  const { toast } = useToast();
  return toast;
}
