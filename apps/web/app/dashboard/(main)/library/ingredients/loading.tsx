import { PageHeader, Table } from "@/components";

export default function IngredientsLoading() {
  return (
    <>
      <PageHeader.Skeleton hasAction />
      <Table.Skeleton rowNumber={10} columnCount={8} showFilters />
    </>
  );
}
