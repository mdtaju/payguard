"use client";
// import { dateFormation } from "@/lib/dateFormation";
import { DocumentType } from "@/types/allTypes";
import type { TableProps } from "antd";
import { message, Modal, Select, Spin, Table } from "antd";
import dayjs from "dayjs";
import { useState } from "react";

import { storageFileDownload } from "@/lib/storageFileDownload";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"; // Import plugin
import isSameOrBefore from "dayjs/plugin/isSameOrBefore"; // Import plugin
import Link from "next/link";

dayjs.extend(isSameOrAfter); // Extend Day.js with the plugin
dayjs.extend(isSameOrBefore); // Extend Day.js with the plugin

const DocumentsTableEditable = ({
  data,
  token,
}: {
  data: DocumentType[];
  token: string;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocData, setSelectedDocData] = useState({
    title: "",
    id: "",
    user_id: "",
  });
  const [status, setStatus] = useState("");
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentData, setPaymentData] = useState(data || []);
  const [messageApi, contextHolder] = message.useMessage();

  const handleFileDownload = async (file_url: string) => {
    setDownloadLoading(true);
    try {
      await storageFileDownload(file_url);
      messageApi.open({
        type: "success",
        content: "File downloaded",
        duration: 3,
      });
    } catch (error) {
      messageApi.open({
        type: "error",
        content: error as string,
        duration: 3,
      });
    } finally {
      setDownloadLoading(false);
    }
  };

  const showModal = ({
    id,
    title,
    user_id,
  }: {
    id: string;
    title: string;
    user_id: string;
  }) => {
    setSelectedDocData({ id, title, user_id });
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/documents/${selectedDocData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
            title: selectedDocData.title,
            user_id: selectedDocData.user_id,
          }),
        }
      );
      const data = await res.json();
      console.log(data);

      setPaymentData((prevData) =>
        prevData.map((item) =>
          item._id === selectedDocData.id ? { ...item, status } : item
        )
      );
      setIsModalOpen(false);
    } catch {
      setError("Update failed");
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleChange = (value: string) => {
    setStatus(value);
  };
  const columns: TableProps<DocumentType>["columns"] = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "File URL",
      dataIndex: "file_url",
      key: "file_url",
      render: (_, { file_url }) => {
        return (
          <div className="max-w-[200px] overflow-hidden flex items-center gap-4">
            <div className="w-[150px]">
              <Link href={file_url} target="_blank">
                <span className="line-clamp-1 hover:text-accent underline transition-all">{`${file_url}`}</span>
              </Link>
            </div>
            <button
              aria-label="copy-to-clipboard"
              className={`p-1 hover:text-accent active:scale-90 transition-all ${
                downloadLoading ? "hover:text-primary brightness-90" : ""
              }`}
              disabled={downloadLoading}
              onClick={() => handleFileDownload(file_url)}>
              {downloadLoading ? (
                <Spin size="small" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="size-5">
                  <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
                  <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
                </svg>
              )}
            </button>
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, { status, _id, title, user_id }) => {
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
            <button
              aria-label="edit"
              onClick={() => showModal({ id: _id, title, user_id })}>
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
    },
  ];
  return (
    <div>
      {contextHolder}
      <div className="w-full overflow-auto mt-6">
        <Table<DocumentType>
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

export default DocumentsTableEditable;
