"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/session";

async function requireMenuManager() {
  const session = await getSession();
  if (!session || (session.role !== "staff" && session.role !== "admin")) {
    redirect("/");
  }
}

function readText(formData, key) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function validateImageUrl(value) {
  if (!value) return true;
  if (value.startsWith("/") && !value.startsWith("//")) return true;

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export async function addDishAction(formData) {
  await requireMenuManager();

  const name = readText(formData, "name");
  const description = readText(formData, "description");
  const category = readText(formData, "category");
  const imageUrl = readText(formData, "image_url");
  const price = Number(readText(formData, "price"));
  const ingredients = readText(formData, "ingredients")
    .split(",")
    .map((ingredient) => ingredient.trim())
    .filter(Boolean);

  if (
    name.length < 2 ||
    name.length > 100 ||
    !description ||
    description.length > 1000 ||
    !category ||
    category.length > 60 ||
    !Number.isFinite(price) ||
    price <= 0 ||
    price > 1000000 ||
    !validateImageUrl(imageUrl) ||
    ingredients.length > 30
  ) {
    redirect("/dashboard/menu?error=invalid");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("dishes").insert({
    name,
    description,
    category,
    price,
    image_url: imageUrl || null,
    ingredients,
    is_available: true,
    is_hidden: false,
    finished_today: false,
  });

  if (error) {
    console.error("Could not add a dish to the catalog:", error);
    redirect("/dashboard/menu?error=save");
  }

  revalidatePath("/dashboard/menu");
  revalidatePath("/menu");
  revalidatePath("/");
  revalidatePath("/api/dishes");
  redirect("/dashboard/menu?success=created");
}

export async function updateDishFlagsAction(formData) {
  await requireMenuManager();

  const dishId = Number(readText(formData, "dishId"));
  const field = readText(formData, "field");
  const value = readText(formData, "value");
  const permittedFields = new Set([
    "is_hidden",
    "finished_today",
    "is_available",
  ]);

  if (
    !Number.isSafeInteger(dishId) ||
    dishId < 1 ||
    !permittedFields.has(field) ||
    (value !== "true" && value !== "false")
  ) {
    redirect("/dashboard/menu?error=invalid");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("dishes")
    .update({ [field]: value === "true" })
    .eq("id", dishId)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    console.error("Could not update dish availability flags:", error);
    redirect("/dashboard/menu?error=update");
  }

  revalidatePath("/dashboard/menu");
  revalidatePath("/menu");
  revalidatePath("/");
  revalidatePath(`/menu/${dishId}`);
  revalidatePath("/api/dishes");
  redirect("/dashboard/menu?success=updated");
}
