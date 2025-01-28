import DocumentsTable from "@/components/DocumentsTable";
import { accessTokenMake } from "@/serverActions/accessToken";
import { GetUser } from "@/serverActions/getUser";
import { AuthUser, DocumentType } from "@/types/allTypes";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";

const AllDocumentsPage = async () => {
  const user: AuthUser | null = await GetUser();
  if (user?.user_metadata?.role !== "user") redirect("/dashboard");

  const token = accessTokenMake({
    role: "user",
    id: user?.identities ? user?.identities[0]?.user_id : "",
  });

  const serverResponse = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/documents`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    }
  );
  // if successfully save payment data to database
  const res = await serverResponse.json();
  const data: DocumentType[] = res.result;
  return (
    <div>
      <DocumentsTable data={data} />
    </div>
  );
};

export default AllDocumentsPage;
