import { CompetitionCardPageContent } from "@/components/dashboard/competition-card-page-content";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ name?: string; status?: string }>;
};

export default async function CompetitionCardPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { name, status } = await searchParams;
  return (
    <CompetitionCardPageContent
      competitionId={id}
      competitionName={name ?? undefined}
      status={status ?? undefined}
    />
  );
}
