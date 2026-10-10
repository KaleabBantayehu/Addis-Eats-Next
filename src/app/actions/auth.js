"use server";

import { destroySession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function handleSignOut() {
  try {
    await destroySession();
  } catch (error) {
    console.error("Error during sign out:", error);
  }

  
  redirect("/signin");
}