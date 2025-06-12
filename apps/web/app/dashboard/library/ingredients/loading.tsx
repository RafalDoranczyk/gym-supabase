import { PageHeader, Table } from "@/components";

export default function Loading() {
  return (
    <div>
      <PageHeader.Skeleton hasAction />
      <Table.Skeleton rowNumber={10} columnCount={8} showFilters />
    </div>
  );
}
