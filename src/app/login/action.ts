"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const signIn = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return redirect(`/login?message=${error.message}`);
  }

  return redirect("/dashboard");
};
