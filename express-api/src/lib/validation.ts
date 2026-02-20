import z from "zod";

export const passwordSchema = z
.string()
.min(8, "Password must be 8 digit long.")
.max(50, "Password must be 50 characters or less.")
.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character")
.regex(/^\S*$/, "Password must not contain spaces.");

