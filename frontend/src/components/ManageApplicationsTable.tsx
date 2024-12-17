"use client";

import { useGetEventApplications } from "@/utils/api";

interface ManageApplicationsTableProps {
  eventId: number;
}

const ManageApplicationsTable = ({ eventId }: ManageApplicationsTableProps) => {
  const { data: eventApplications } = useGetEventApplications(eventId);
  return eventApplications?.length;
};

export default ManageApplicationsTable;
