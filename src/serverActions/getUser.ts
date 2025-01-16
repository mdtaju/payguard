"use server";

import { AuthUser } from "@/types/allTypes";

import { createClient } from "@/utils/supabase/server";

export async function GetUser() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      return data.user as AuthUser;
    } else {
      return null;
    }
  } catch {
    return null;
  }
  // return {
  //   user_metadata: {
  //     displayName: "md tajuuddin",
  //     role: "user",
  //   },
  // } as AuthUser;
  // return null;
}
