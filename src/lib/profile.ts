export const profile = {
  name: process.env.NEXT_PUBLIC_PROFILE_NAME || "Xavier Puig",
  title: process.env.NEXT_PUBLIC_PROFILE_TITLE || "Product Manager",
  bio:
    process.env.NEXT_PUBLIC_PROFILE_BIO ||
    "I'm a Product Manager focused on turning complex problems into useful products through data, customer insight, experimentation, and systems thinking.",
  linkedin: "https://www.linkedin.com/in/xpuig1/",
  github: "https://github.com/zeropandes04",
  avatarUrl: "/avatar.jpg", // Place your photo at public/avatar.jpg
};
