"use client";
import { storageFileDownload } from "@/lib/storageFileDownload";
import { DocumentType } from "@/types/allTypes";
import type { TableProps } from "antd";
import { message, Spin, Table } from "antd";
import dayjs from "dayjs";
import Link from "next/link";
import { useState } from "react";

const DocumentsTable = ({ data }: { data: DocumentType[] }) => {
  const [downloadLoading, setDownloadLoading] = useState(false);
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

  const columns: TableProps<DocumentType>["columns"] = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (_, { title }) => (
        <div className="max-w-[250px]">
          <span className="line-clamp-1">{title}</span>
        </div>
      ),
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
      title: "Uploaded Date",
      dataIndex: "uploaded_at",
      key: "uploaded_at",
      render: (_, { uploaded_at }) =>
        dayjs(uploaded_at).format("HH-MM-DD HH:mm:ss"),
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
          dataSource={data}
          rowKey={"_id"}
        />
      </div>
    </div>
  );
};

export default DocumentsTable;
