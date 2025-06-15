import { PageHeader, Table } from "@/components";

export default function MealsLoading() {
  return (
    <>
      <PageHeader.Skeleton hasAction />
      <Table.Skeleton />
    </>
  );
}
