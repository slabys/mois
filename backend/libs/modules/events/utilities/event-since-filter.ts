import { Between, LessThan, MoreThan } from "typeorm";
import type { EventFilter } from "../models";

/**
 * Create new since filter
 * @param filter Filter
 * @returns { since: ... }
 */
export const filterSince = (filter?: EventFilter) => {
  if (!filter) return {};

  return {
    since:
      filter.since && filter.to
        ? Between(filter.since, filter.to)
        : filter.since
        ? MoreThan(filter.since)
        : filter.to
        ? LessThan(filter.to)
        : undefined,
  };
};
