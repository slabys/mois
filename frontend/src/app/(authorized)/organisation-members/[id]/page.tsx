import { getAllOrganizationsQueryKey } from "@/utils/api";
import { type Organization } from "@/utils/api.schemas";
import OrganizationsMemberList from "@components/OrganizationsMemberList/OrganizationsMemberList";
import { Container } from "@mantine/core";

interface UseFetchAllEventsProps {
  params: Promise<{ id: string }>;
}

const OrganizationMembersPage = async ({ params }: UseFetchAllEventsProps) => {
  const { id: organizationId } = await params;
  return (
    <Container size="xl">
      <OrganizationsMemberList organizationId={organizationId} />
    </Container>
  );
};

export const revalidate = 60;

const UseFetchOrganizationMembers = async () => {
  const queryKey = getAllOrganizationsQueryKey();
  const organizationList: Organization[] = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${queryKey[0]}`)
    .then((res) => res.json())
    .catch((e) => console.error(e));

  if (!organizationList) {
    return [];
  }

  return (
    organizationList?.map((organization) => {
      return {
        id: organization.id,
      };
    }) ?? []
  );
};

export async function generateStaticParams() {
  return UseFetchOrganizationMembers();
}

export default OrganizationMembersPage;
