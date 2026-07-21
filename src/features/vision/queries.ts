import { queryOptions } from "@tanstack/react-query";

import { getVision } from "./visionService";

export function visionQuery() {
  return queryOptions({
    queryKey: ["vision"],
    queryFn: getVision,
  });
}