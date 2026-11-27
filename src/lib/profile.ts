export const profile = {
  name: process.env.NEXT_PUBLIC_PROFILE_NAME || "Xavier Puig",
  title: process.env.NEXT_PUBLIC_PROFILE_TITLE || "Senior Product Manager",
  bio:
    process.env.NEXT_PUBLIC_PROFILE_BIO ||
    "Senior Product Manager and former Senior Product Designer, using product taste and first principles to build AI products people love.",
  focus: ["Senior Product Manager", "Former Senior Product Designer"],
  tagline: "building AI products people love.",
  linkedin: "https://www.linkedin.com/in/xpuig1/",
  github: "https://github.com/zeropandes04",
  avatarUrl: "/avatar.jpg", // Place your photo at public/avatar.jpg
};
