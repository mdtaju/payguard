"use client";
import { createSupabaseClient } from "@/utils/supabase/client";
import { message } from "antd";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Form from "../Form";
import Input from "../Input";

const UploadDocument = ({
  token,
  userId,
}: {
  token: string;
  userId: string;
}) => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    const fileExtension = file?.type.split("/")[1] || "";
    const fileName = file?.name.replace(`.${fileExtension}`, "") || "";
    const id = uuidv4();
    const filePath = `user_files/${id}-${fileName}.${fileExtension}`;

    if (!file || !title) {
      return messageApi.open({
        type: "error",
        content: "All fields are required",
        duration: 3,
      });
    }

    if (file.size > 12582912) {
      // 12582912 Bytes = 12 MB
      messageApi.open({
        type: "error",
        content: "File size can not allowed more than 12 MB.",
        duration: 5,
      });
    }
    try {
      const { data, error } = await createSupabaseClient()
        .storage.from("payguard")
        .upload(filePath, file);
      if (error) {
        return messageApi.open({
          type: "error",
          content: "Storage error. Please, try again with legal file",
          duration: 5,
        });
      }
      const serverResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/documents`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            file_url: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_ENDPOINT}/${data.fullPath}`,
            title,
            user_id: userId,
          }),
        }
      );

      const res = await serverResponse.json();

      // if successfully save data to database
      if (res?.status === 201) {
        return messageApi.open({
          type: "success",
          content: "File successfully uploaded",
          duration: 5,
        });
      } else {
        return messageApi.open({
          type: "error",
          content: "File successfully uploaded. But, not store in database.",
          duration: 5,
        });
      }
    } catch {
      messageApi.open({
        type: "error",
        content: "Internal server error.",
        duration: 5,
      });
    } finally {
      setLoading(false);
      setFile(null);
      setTitle("");
    }
  };
  return (
    <div>
      {contextHolder}
      <Form title="Upload file">
        <form onSubmit={handleSubmit}>
          <Input
            title="Title"
            placeholder="Enter a title"
            type="text"
            name="title"
            required={true}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            title="Upload"
            placeholder="Enter your file"
            type="file"
            name="file"
            required={true}
            onChange={handleFileChange}
          />
          <span className="text-xs font-semibold">
            (Maximum file size is 12 MB)
          </span>
          <button type="submit" disabled={loading} className="w-full btn mt-6">
            {loading ? "loading..." : "Submit"}
          </button>
        </form>
      </Form>
    </div>
  );
};

export default UploadDocument;
