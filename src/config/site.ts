// Central editable configuration for Fun Media Entertainment.
// Update crew, services, career roles, social links, and contact email here.

export const site = {
  name: "Fun Media Entertainment",
  shortName: "Fun Media",
  tagline: "Creating Imaginative Worlds Through Animation",
  description:
    "Fun Media Entertainment is a creative production studio delivering professional 3D modeling, texturing, animation, rigging, lighting, and rendering services.",
  email: "contact@funmediaentertainment.com",
  projectInquirySubject: "Project Inquiry – Fun Media Entertainment",
  socials: {
    instagram: "https://instagram.com/",
    linkedin: "https://www.linkedin.com/in/funmedia-entertainment-92b700388",
    youtube: "https://youtube.com/",
    behance: "https://behance.net/",
  },
} as const;

export const mailto = (subject = site.projectInquirySubject) =>
  `mailto:${site.email}?subject=${encodeURIComponent(subject)}`;

export type CrewMember = {
  name: string;
  role: string;
  intro?: string;
  photo?: string; // path under /public/images/crew/
  link?: string;
};

export const crew: CrewMember[] = [
  {
    name: "Subhadip Bera",
    role: "CEO and Founder",
    intro: "Leading the creative vision at Fun Media Entertainment.",
    photo: "/images/crew/ceo.jpg",
  },
  {
    name: "Lipika Gayen",
    role: "HR Executive",
    intro: "Building the Fun Media Entertainment crew and culture.",
    photo: "/images/crew/hr.jpg",
  },
  {
    name: "Sagar Das",
    role: "Co-Founder and Technical Director",
    intro: "Directing production pipelines and technical craft.",
    photo: "/images/crew/tech.jpg",
  },
  {
    name: "Sujit Sasmal",
    role: "Web Developer",
    intro: "Engineering the digital presence of Fun Media Entertainment.",
    photo: "/images/crew/web.jpg",
  },
];

export type Service = {
  title: string;
  description: string;
  icon: string; // lucide icon name
};

export const services: Service[] = [
  {
    title: "3D Modeling",
    description:
      "Professional creation of characters, props, products, environments, and production-ready 3D assets.",
    icon: "Box",
  },
  {
    title: "Texturing",
    description:
      "High-quality materials and textures for realistic, stylized, and animation-ready models.",
    icon: "Palette",
  },
  {
    title: "3D Animation",
    description:
      "Professional character and object animation focused on movement, timing, acting, and visual presentation.",
    icon: "Film",
  },
  {
    title: "2D Animation",
    description:
      "Creative 2D character animation, storytelling, promotional content, and digital media production.",
    icon: "PenTool",
  },
  {
    title: "Rigging",
    description:
      "Animator-friendly character and object rigs designed for efficient production workflows.",
    icon: "Bone",
  },
  {
    title: "Product Lighting and Rendering",
    description:
      "Professional product lighting, presentation, rendering, and commercial visualization.",
    icon: "Lightbulb",
  },
];

export const careerRoles = [
  "3D Modeler",
  "Texture Artist",
  "3D Animator",
  "2D Animator",
  "3D Rigger",
  "Lighting and Rendering Artist",
  "Web Developer",
  "HR",
  "Other",
] as const;

// Empty until real projects are added. See src/routes/portfolio.tsx.
export type PortfolioProject = {
  title: string;
  category: string;
  thumbnail: string;
  images?: string[];
  video?: string;
  description?: string;
  software?: string[];
  credits?: string[];
};
export const portfolio: PortfolioProject[] = [
  {
    title: "3D character",
    category: "3D Modeling",
    thumbnail: "https://placehold.co/800x600/1e1e24/6a80ff?text=3D+Character",
    description: "Detailed 3D character modeling and texturing.",
  },
  {
    title: "rigging work",
    category: "Rigging",
    thumbnail: "https://placehold.co/800x600/1e1e24/ff6a80?text=Rigging+Work",
    description: "Advanced bipedal and quadruped character rigging.",
  },
  {
    title: "environment desing( cartoon)",
    category: "Environment Design",
    thumbnail: "https://placehold.co/800x600/1e1e24/80ff6a?text=Environment+Design",
    description: "Stylized cartoon environment design and creation.",
  },
  {
    title: "2D animation",
    category: "2D Animation",
    thumbnail: "https://placehold.co/800x600/1e1e24/ffdf6a?text=2D+Animation",
    description: "High-quality 2D character animation and motion graphics.",
  },
];
