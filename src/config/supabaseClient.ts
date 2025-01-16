import { createSupabaseClient } from "@/utils/supabase/client";

function getStorage() {
  const { storage } = createSupabaseClient();
  return storage;
}

type UploadProps = {
  file: File;
  bucket: string;
  folder?: string;
};

export const uploadFile = async ({ file, bucket, folder }: UploadProps) => {
  //   const fileName = file.name;
  //   const fileExtension = fileName.slice(fileName.lastIndexOf(".") + 1);
  //   const path = `${folder ? folder + "/" : ""}${uuidv4()}.${fileExtension}`;

  const storage = getStorage();

  const { data, error } = await storage.from(bucket).upload("user_files", file);

  if (error) {
    return { imageUrl: "", error: "Image upload failed" };
  }

  const imageUrl = `${process.env
    .NEXT_PUBLIC_SUPABASE_STORAGE_ENDPOINT!}/storage/v1/object/public/${bucket}/${
    data?.path
  }`;

  return { imageUrl, error: "" };
};
