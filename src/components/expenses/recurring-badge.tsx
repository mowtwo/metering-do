"use client";

import { Badge } from "@/components/ui/badge";
import { RECURRING_INTERVAL_LABELS } from "@/lib/constants";
import type { RecurringInterval } from "@/lib/db";

interface RecurringBadgeProps {
  interval: RecurringInterval;
}

export function RecurringBadge({ interval }: RecurringBadgeProps) {
  return (
    <Badge variant="secondary" className="text-xs">
      {RECURRING_INTERVAL_LABELS[interval]}
    </Badge>
  );
}
