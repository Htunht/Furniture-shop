import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

// Cloudinary ကို Setup လုပ်ခြင်း (Railway Environment Variables များကို အသုံးပြုပါမည်)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
});

// Multer အတွက် Cloudinary Storage ကို သတ်မှတ်ခြင်း
export const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "furniture-shop-uploads", // Cloudinary ပေါ်တွင် သိမ်းမည့် ဖိုဒါအမည်
    allowedFormats: ["jpeg", "png", "jpg", "webp"], // လက်ခံမည့် ပုံစံများ
  } as any,
});

export const upload = multer({ storage: storage });
export { cloudinary };
