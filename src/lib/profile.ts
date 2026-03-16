export const profile = {
  name: process.env.NEXT_PUBLIC_PROFILE_NAME || "Xavier Puig",
  title: process.env.NEXT_PUBLIC_PROFILE_TITLE || "Product Manager",
  bio:
    process.env.NEXT_PUBLIC_PROFILE_BIO ||
    "I'm a Product Manager driven by creating delightful and intuitive user experiences. I blend innovation with user-centric design — explore my case studies below.",
  email: "xavierpuig@icloud.com",
  linkedin: "https://www.linkedin.com/in/xpuig1/",
  avatarUrl: "/avatar.jpg", // Place your photo at public/avatar.jpg
};
