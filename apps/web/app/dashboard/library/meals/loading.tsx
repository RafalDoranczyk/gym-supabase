import { PageHeader, Table } from "@/components";

export default function MealsLoading() {
  return (
    <div>
      <PageHeader.Skeleton hasAction />
      <Table.Skeleton />
    </div>
  );
}
