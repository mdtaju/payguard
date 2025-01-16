"use client";
// import { dateFormation } from "@/lib/dateFormation";
import { PaymentType } from "@/types/allTypes";
import type { TableProps } from "antd";
import { DatePicker, Modal, Select, Table } from "antd";
import dayjs from "dayjs";
import { useState } from "react";

import isSameOrAfter from "dayjs/plugin/isSameOrAfter"; // Import plugin
import isSameOrBefore from "dayjs/plugin/isSameOrBefore"; // Import plugin

dayjs.extend(isSameOrAfter); // Extend Day.js with the plugin
dayjs.extend(isSameOrBefore); // Extend Day.js with the plugin

const { RangePicker } = DatePicker;

const PaymentsTableEditable = ({
  data,
  token,
}: {
  data: PaymentType[];
  token: string;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentData, setPaymentData] = useState(data || []);
  //   const [filteredDates, setFilteredDates] = useState<[string, string] | null>(
  //     null
  //   );

  // Handle the date range picker change
  //   const handleDateRangeChange = (
  //     dates: [Dayjs | null, Dayjs | null] | null
  //     // dateStrings: [string, string]
  //   ) => {
  //     if (dates) {
  //       setFilteredDates([dates[0].startOf("day"), dates[1].endOf("day")]);
  //     } else {
  //       setFilteredDates(null);
  //     }
  //   };

  const showModal = (id: string) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/${selectedId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );
      const data = await res.json();
      console.log(data);
      setPaymentData((prevData) =>
        prevData.map((item) =>
          item._id === selectedId ? { ...item, status } : item
        )
      );
      setIsModalOpen(false);
    } catch {
      setError("Update failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleChange = (value: string) => {
    setStatus(value);
  };
  const columns: TableProps<PaymentType>["columns"] = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
      // render: (_, { company_name: companyName, evaluationId }) => (
      //     <Link
      //         className="text-blue-500 hover:underline"
      //         target="_blank"
      //         href={`/company/${companyName}/evaluation/${evaluationId}/OnlineEvaluationTest`}
      //     >
      //         {`#${evaluationId}`}
      //     </Link>
      // ),
    },
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
      render: (_, { status, _id }) => {
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
          <div className="flex items-center gap-3">
            <span className={style}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
            <button aria-label="edit" onClick={() => showModal(_id)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
            </button>
          </div>
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
  return (
    <div>
      {/* <RangePicker onChange={handleDateRangeChange} /> */}
      <div className="w-full overflow-auto mt-6">
        <Table<PaymentType>
          scroll={{ x: "max-content" }}
          className="w-full"
          columns={columns}
          dataSource={paymentData}
          rowKey={"_id"}
          showSorterTooltip={{ target: "sorter-icon" }}
        />
      </div>
      <Modal
        title="Update Status"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}>
        <Select
          defaultValue="pending"
          style={{ width: "100%" }}
          onChange={handleChange}
          options={[
            { value: "pending", label: "Pending" },
            { value: "approved", label: "Approved" },
            { value: "rejected", label: "Rejected" },
          ]}
        />
        <p className="mt-6 text-center text-red-500 font-semibold">{error}</p>
      </Modal>
    </div>
  );
};

export default PaymentsTableEditable;
