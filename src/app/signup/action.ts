"use server";
import bcrypt from "bcrypt";

import { createMongoConnection } from "@/config/mongodb";
import User from "@/models/userModels";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";

export const signUp = async (formData: FormData) => {
  const origin = (await headers()).get("origin");
  const name = formData.get("full_name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const role = formData.get("role") as string;
  const supabase = createClient();

  if (
    name === "" ||
    email === "" ||
    password === "" ||
    confirmPassword === "" ||
    role === ""
  ) {
    return redirect("/signup?message=All fields are required");
  }

  if (password !== confirmPassword) {
    return redirect("/signup?message=Passwords do not match");
  }

  let redirectPath = "/";

  try {
    const hashedPassword = await bcrypt.hash(password as string, 10);

    // send data to supabase auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/api/auth/callback`,
        data: {
          role,
          displayName: name,
        },
      },
    });

    // supabase error
    if (error) {
      redirectPath = `/signup?message=${error.message}`;
      throw new Error(`${error.message}`);
    }

    await createMongoConnection(); // mondoDB connection

    // store user to mongodb
    const res = await User.insertMany([
      {
        name,
        email,
        password: hashedPassword,
        role,
        id: data?.user?.identities && data?.user?.identities[0]?.user_id,
        created_at:
          data?.user?.identities && data?.user?.identities[0]?.created_at,
      },
    ]);

    const user = Response.json(res);
    // redirecting to message page as successfully signup
    if (!user?.ok) {
      await supabase.auth.admin.deleteUser(data.user?.id as string);

      // mongodb error
      redirectPath = `/message?message=Signup failed please try again or use another email`;
      throw new Error(
        `/message?message=Signup failed please try again or use another email`
      );
    }

    redirectPath = `/dashboard`;
  } catch {
    redirectPath = `/message?message=Signup failed please try again.`;
  } finally {
    redirect(redirectPath);
  }
};
