import Profile from "@/components/Profile";
import { accessTokenMake } from "@/serverActions/accessToken";
import { GetUser } from "@/serverActions/getUser";
import { AuthUser } from "@/types/allTypes";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";

const ProfilePage = async () => {
  const user: AuthUser | null = await GetUser();

  if (user === null) redirect("/");

  const token = accessTokenMake({
    role: "user",
    id: user?.identities ? user?.identities[0]?.user_id : "",
  });

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  let photo_url = "";
  if (data?.result) {
    photo_url = data.result[0]?.photo_url;
  }
  return (
    <div>
      <Profile
        token={token}
        userId={user?.identities ? user?.identities[0]?.user_id : ""}
        photoUrl={photo_url}
      />
    </div>
  );
};

export default ProfilePage;
