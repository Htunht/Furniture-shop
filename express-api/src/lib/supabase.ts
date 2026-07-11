import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "";
const bucketName = process.env.SUPABASE_BUCKET || "tiger-balm";

if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase URL or Key is missing. Storage uploads will fail.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Uploads a multer file buffer to Supabase Storage bucket and returns the public URL.
 */
export async function uploadToSupabase(file: Express.Multer.File): Promise<string> {
  if (!file || !file.buffer) {
    throw new Error("No file buffer provided for upload.");
  }

  // Generate unique filename
  const fileExt = file.originalname.split(".").pop();
  const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(uniqueName, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });

  if (error) {
    console.error("Supabase Upload Error:", error);
    throw error;
  }

  // Retrieve public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucketName)
    .getPublicUrl(uniqueName);

  return publicUrl;
}
