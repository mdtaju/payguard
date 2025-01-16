"use client";
import { PaymentType } from "@/types/allTypes";
import type { TableProps } from "antd";
import { Table } from "antd";
import dayjs from "dayjs";

const columns: TableProps<PaymentType>["columns"] = [
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
    render: (_, { amount }) => {
      return <span>{`$${amount}`}</span>;
    },
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (_, { status }) => {
      let style = "";
      switch (status) {
        case "pending":
          style = "text-yellow-500";
          break;
        case "approved":
          style = "text-green-500";
          break;
        default:
          style = "text-red-500";
          break;
      }
      return (
        <span className={style}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      );
    },
    filters: [
      {
        text: "Pending",
        value: "pending",
      },
      {
        text: "Approved",
        value: "approved",
      },
      {
        text: "Rejected",
        value: "rejected",
      },
    ],
    onFilter: (value, record) => record.status.indexOf(value as string) === 0,
  },
  {
    title: "Creation Date",
    dataIndex: "created_at",
    key: "created_at",
    render: (text: string) => dayjs(text).format("YYYY-MM-DD HH:mm:ss"),
    //   onFilter: (value, record) => {
    //     if (!filteredDates) return true; // If no filter is applied, show all rows
    //     const recordDate = dayjs(record.created_at);
    //     return (
    //       recordDate.isSameOrAfter(filteredDates[0]) &&
    //       recordDate.isSameOrBefore(filteredDates[1])
    //     );
    //   },
    //   filteredValue: filteredDates ? [filteredDates] : null,
  },
];

const PaymentsTable = ({ data }: { data: PaymentType[] }) => {
  return (
    <div>
      <div className="w-full overflow-auto mt-6">
        <Table<PaymentType>
          scroll={{ x: "max-content" }}
          className="w-full"
          columns={columns}
          dataSource={data}
          rowKey={"_id"}
        />
      </div>
    </div>
  );
};

export default PaymentsTable;
