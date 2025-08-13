"use server";

import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { cookies } from "next/headers";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

// Create Prisma client instance
const prisma = new PrismaClient();

// Send reset link
export async function sendResetLink(formData) {
  const email = formData.get("email");

  if (!email) return { success: false, message: "Email is required" };

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // Don't reveal if email exists
    return { success: true, message: "If this email exists, a reset link was sent." };
  }

  // Generate token
  const token = crypto.randomBytes(32).toString("hex");

  // Store token in HTTP-only cookie (15 min)
  cookies().set("reset_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 15 * 60,
    path: "/",
  });

  // Send email
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

  await transporter.sendMail({
    from: `"Support" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Password Reset",
    html: `<p>You requested a password reset.</p>
           <p><a href="${resetUrl}">Click here</a> to reset your password. This link expires in 15 minutes.</p>`,
  });

  return { success: true, message: "If this email exists, a reset link was sent." };
}

// Reset password
export async function resetPassword(formData) {
  const token = formData.get("token");
  const password = formData.get("password");
  const email = formData.get("email");

  const cookieToken = cookies().get("reset_token")?.value;

  if (!cookieToken || token !== cookieToken) {
    return { success: false, message: "Invalid or expired token" };
  }

  if (!email || !password) return { success: false, message: "Missing email or password" };

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { success: false, message: "User not found" };

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: hashedPassword },
  });

  cookies().delete("reset_token");

  return { success: true, message: "Password updated successfully" };
}
