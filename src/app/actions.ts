"use server";

import { encodedRedirect } from "../../utils/utils";
import { createClient } from "../../utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { User } from "./types/common";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    if (error) {
      return { error: error.message };
    }
  } else {
    return { success: "User created successfully" };
  }
};

export const signUpAdminAction = async (admin: User) => {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!admin.email || !admin.password) {
    return { error: "Email and password are required" };
  }

  const { data, error } = await supabase.auth.signUp({
    email: admin.email,
    password: admin.password,
  });

  if (error) {
    return { error: error.message };
  }

  const userId = data.user?.id;
  if (!userId) {
    return { error: "User ID not found" };
  }
  const { error: upsertError } = await supabase.from("users").upsert({
    id: userId,
    name: admin.name,
    email: admin.email,
    contact_number: admin.contact_number,
    role: admin.role, // or any other role you want to assign
    active: admin.active,
    terminal_access: admin.terminal_access,
    assigned_retailers: admin.assigned_retailers,
  });

  if (upsertError) {
    return { error: upsertError.message };
  }

  return { success: "User created successfully" };
};

export const getAdminsAction = async () => {
  const supabase = await createClient();

  const { data: users, error } = await supabase
    .from("users")
    .select("*")
    .in("role", ["admin", "superAdmin"]);

  if (error) {
    return { error: error.message };
  }

  return { users };
};

export const checkUserSignedIn = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/");
  }
};

export const getUserAction = async () => {
  const supabase = await createClient();

  // First get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("Auth error:", authError);
    return null;
  }

  // Then fetch user data from users table
  const { data: userData, error: dbError } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id) // Remove quotes around ID
    .single(); // Use single() for one row

  if (dbError) {
    console.error("Database error:", dbError);
    return null;
  }

  return userData;
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  console.log("Error: ", error);

  if (error) {
    return error.message;
  }

  const { data: userData, error: dbError } = await supabase
    .from("users")
    .select("*")
    .eq("id", data.user.id)
    .single(); // Use single() for one row

  if (dbError) {
    console.error("Database error:", dbError);
    return dbError.message;
  }

  return { userData };

  //return redirect("/protected/dashboard");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  console.log("Signing out");
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/");
};
