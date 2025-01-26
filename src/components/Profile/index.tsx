"use client";
import React, { useState } from "react";
import { message, Upload } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import ImgCrop from "antd-img-crop";
import { v4 as uuidv4 } from "uuid";
import { createSupabaseClient } from "@/utils/supabase/client";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const Profile = ({
  token,
  userId,
  photoUrl,
}: {
  token: string;
  userId: string;
  photoUrl: string;
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>(
    photoUrl
      ? [
          {
            uid: userId,
            name: "profile image",
            status: "done",
            url: photoUrl,
          },
        ]
      : []
  );
  const [messageApi, contextHolder] = message.useMessage();

  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as FileType);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;
    const fileExtension = file?.type.split("/")[1] || "";
    const fileName = file?.name.replace(`.${fileExtension}`, "") || "";
    const id = uuidv4();
    const filePath = `avatar/${id}-${fileName}.${fileExtension}`;

    if (file.size > 12582912) {
      // 12582912 Bytes = 12 MB
      messageApi.open({
        type: "error",
        content: "File size can not allowed more than 12 MB.",
        duration: 5,
      });
      return onError?.("");
    }
    try {
      // Replace with your upload endpoint
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
      if (data) {
        const serverResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/user/${userId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              file_url: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_ENDPOINT}/${data.fullPath}`,
              update_type: "file",
            }),
          }
        );

        const res = await serverResponse.json();
        // if successfully save data to database
        if (res?.status === 200) {
          messageApi.open({
            type: "success",
            content: "File successfully uploaded",
            duration: 5,
          });
          return onSuccess?.("");
        } else {
          messageApi.open({
            type: "error",
            content: "Image successfully uploaded. But, not store in database.",
            duration: 5,
          });
          return onError?.("Not uploaded. please, try again");
        }
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.log(error);
      messageApi.open({
        type: "error",
        content: "Something went wrong. Please, try again",
        duration: 5,
      });
      onError?.(error);
    }
  };

  return (
    <div>
      {contextHolder}
      <div className="max-w-fit mx-auto px-4 text-center">
        <h1 className="mb-3 font-semibold">Profile Image</h1>
        <ImgCrop modalTitle="Resize Image" modalOk="Upload">
          <Upload
            // action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
            accept=".jpg,.jpeg,.png,.svg"
            maxCount={1}
            multiple={false}
            // action={fileUploadAction}
            listType="picture-card"
            fileList={fileList}
            onChange={onChange}
            onPreview={onPreview}
            customRequest={handleUpload}>
            {fileList.length < 1 && "Choose"}
          </Upload>
        </ImgCrop>
      </div>
    </div>
  );
};

export default Profile;
