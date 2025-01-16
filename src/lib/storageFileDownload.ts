import { createSupabaseClient } from "@/utils/supabase/client";

export const storageFileDownload = async (file_url: string) => {
  try {
    const filePath = file_url.replace(
      `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_ENDPOINT}/payguard/`,
      ""
    );
    const { data, error } = await createSupabaseClient()
      .storage.from("payguard")
      .download(filePath);
    if (error) {
      throw new Error("File download failed");
    }
    const url = URL.createObjectURL(data);

    // creating an anchor element and trigger a download
    const a = document.createElement("a");
    a.href = url;
    a.download = filePath.split("/").pop() || "downloaded-file"; // Extract file name
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch {
    throw new Error("Internal server error");
  }
};
