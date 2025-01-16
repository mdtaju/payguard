import UploadDocument from "@/components/UploadDocument";
import { accessTokenMake } from "@/serverActions/accessToken";
import { GetUser } from "@/serverActions/getUser";
import { AuthUser } from "@/types/allTypes";
import { redirect } from "next/navigation";

const UploadDocumentPage = async () => {
  const user: AuthUser | null = await GetUser();
  if (user?.user_metadata?.role !== "user") redirect("/dashboard");

  const token = accessTokenMake({
    role: "user",
  });
  return (
    <div>
      <UploadDocument
        token={token}
        userId={user?.identities ? user?.identities[0]?.user_id : ""}
      />
    </div>
  );
};

export default UploadDocumentPage;
