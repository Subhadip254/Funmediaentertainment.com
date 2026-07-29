/**
 * Fun Media Entertainment — Crew Data
 *
 * ─── HOW TO UPDATE ───────────────────────────────────────────────────────────
 * • Add crew members to `crewMembers[]`. Use a unique `slug` (kebab-case).
 * • Add artist works to `artistWorks[]`. Set `artistSlug` to match the artist's slug.
 * • For artists set `isArtist: true`.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type CrewCategory = 'leadership' | 'management' | 'investors' | 'artists';

export type SocialLinks = {
  linkedin?: string;
};

/** Only used for Leadership, Management & Technology, and Investors. Never on Artists. */
export type ContactInfo = {
  email?: string;
  phone?: string;
};

export type ExperienceEntry = {
  title: string;
  company: string;
  period: string;
  description: string;
};

export type ProjectHighlight = {
  title: string;
  description: string;
};

export type CrewMemberFull = {
  slug: string;            // unique URL-safe identifier e.g. "subhadip-bera"
  name: string;
  role: string;            // displayed designation
  category: CrewCategory;
  photo: string;           // path under /public or placeholder
  intro: string;           // short one-liner for the card
  bio: string;             // full paragraph for the profile page
  experience: ExperienceEntry[];
  skills: string[];
  software: string[];
  achievements: ProjectHighlight[];
  socialLinks: SocialLinks;
  contactInfo?: ContactInfo; // ONLY for non-artists
  isArtist: boolean;
};

export type ArtistWork = {
  id: string;              // unique identifier e.g. "neha-sharma-work-001"
  artistSlug: string;      // must match CrewMemberFull.slug
  title: string;
  contribution: string;    // artist's specific role in the project
  description: string;
  software: string[];
  category: string;        // e.g. "3D Modeling", "Rigging", "Texturing"
  thumbnail: string;       // main preview image URL
  images: string[];        // additional images for lightbox
  videoUrl?: string;       // optional showreel
};

// ─── Crew Members ─────────────────────────────────────────────────────────────

export const crewMembers: CrewMemberFull[] = [
  // ── LEADERSHIP ─────────────────────────────────────────────────────────────
  {
    slug: 'subhadip-bera',
    name: 'Subhadip Bera',
    role: 'CEO & Founder',
    category: 'leadership',
    photo: '/images/crew/ceo.jpg',
    intro: 'Leading the creative vision at Fun Media Entertainment.',
    bio: 'Subhadip Bera is the founder and CEO of Fun Media Entertainment, a creative production studio specialising in high-quality 3D animation, character design, and visual storytelling. With a passion for bringing imaginative worlds to life, Subhadip established the studio with a clear vision: to deliver world-class animation and digital content that resonates with audiences globally. Under his leadership, Fun Media Entertainment has grown into a dynamic team of talented creatives and technologists united by a shared love for the craft.',
    experience: [
      {
        title: 'CEO & Founder',
        company: 'Fun Media Entertainment',
        period: '2022 – Present',
        description: 'Founded and leads the creative and business direction of the studio. Oversees all project pipelines, client relationships, strategic partnerships, and team growth.',
      },
    ],
    skills: ['Creative Direction', 'Business Strategy', 'Project Management', 'Team Leadership', 'Brand Development'],
    software: ['Adobe Creative Suite', 'Autodesk Maya', 'Blender'],
    achievements: [
      {
        title: 'Studio Founding',
        description: 'Founded Fun Media Entertainment with a vision for high-quality creative animation production and storytelling.',
      },
    ],
    socialLinks: {},
    contactInfo: {
      email: 'Subhadip@funmediaentertainment.com',
    },
    isArtist: false,
  },
  {
    slug: 'sagar-das',
    name: 'Sagar Das',
    role: 'Co-Founder & Technical Director',
    category: 'leadership',
    photo: '/images/crew/tech.jpg',
    intro: 'Directing production pipelines and technical craft.',
    bio: 'Sagar Das is the Co-Founder and Technical Director of Fun Media Entertainment, bringing deep expertise in 3D production pipelines, rigging systems, and real-time rendering workflows. He oversees the technical architecture of every project, ensuring the highest standards of quality, efficiency, and innovation. Sagar bridges the gap between creative ambition and technical execution, mentoring the production team and driving continuous improvement across the studio.',
    experience: [
      {
        title: 'Co-Founder & Technical Director',
        company: 'Fun Media Entertainment',
        period: '2022 – Present',
        description: 'Co-founded the studio and leads all technical aspects of production — from pipeline architecture and tool development to final render delivery and quality assurance.',
      },
    ],
    skills: ['Technical Direction', '3D Pipeline Development', 'Team Mentoring', 'Production Planning', 'Quality Assurance'],
    software: ['Autodesk Maya', 'Blender', 'Houdini', 'ZBrush', 'Nuke'],
    achievements: [
      {
        title: 'Pipeline Architecture',
        description: "Designed and implemented the studio's end-to-end production pipeline for 3D animation projects.",
      },
    ],
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/sagar-das-9826802a5/',
    },
    contactInfo: {
      email: 'sagar.das@funmediaentertainment.com',
    },
    isArtist: false, // Pure leadership now
  },

  // ── MANAGEMENT & TECHNOLOGY ────────────────────────────────────────────────
  {
    slug: 'lipika-gayen',
    name: 'Lipika Gayen',
    role: 'HR Executive',
    category: 'management',
    photo: '/images/crew/hr.jpg',
    intro: 'Building the Fun Media Entertainment crew and culture.',
    bio: "Lipika Gayen serves as the HR Executive at Fun Media Entertainment, where she is the heart of the studio's people operations. She manages recruitment, onboarding, team welfare, and organisational culture — ensuring that every member of the Fun Media family feels valued, supported, and empowered. Lipika is committed to nurturing a creative and inclusive workplace where talent can thrive and grow.",
    experience: [
      {
        title: 'HR Executive',
        company: 'Fun Media Entertainment',
        period: '2022 – Present',
        description: 'Handles end-to-end human resources — from talent acquisition and onboarding to employee relations, welfare programmes, and culture-building initiatives.',
      },
    ],
    skills: ['Recruitment', 'Employee Relations', 'Onboarding', 'HR Policy', 'Workplace Culture'],
    software: ['Google Workspace', 'Microsoft Office', 'HR Management Tools'],
    achievements: [
      {
        title: 'Team Expansion',
        description: "Led recruitment drives that expanded the studio's creative and technical workforce significantly.",
      },
    ],
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/funmedia-entertainment-92b700388',
    },
    contactInfo: {
      email: 'hr.lipika@funmediaentertainment.com',
    },
    isArtist: false,
  },
  {
    slug: 'sujit-sasmal',
    name: 'Sujit Sasmal',
    role: 'Web Developer',
    category: 'management',
    photo: '/images/crew/web.jpg',
    intro: 'Engineering the digital presence of Fun Media Entertainment.',
    bio: "Sujit Sasmal is the Web Developer at Fun Media Entertainment, responsible for designing and building the studio's entire digital presence. From crafting immersive front-end experiences to optimising performance and SEO, Sujit ensures that the studio's online presence reflects the same quality and creativity found in its productions. He works at the intersection of design and technology, delivering fast, elegant, and accessible web applications that showcase the studio's work to the world.",
    experience: [
      {
        title: 'Web Developer',
        company: 'Fun Media Entertainment',
        period: '2022 – Present',
        description: 'Designs and develops the studio website and all digital touchpoints, managing the full frontend stack from UI design to deployment.',
      },
    ],
    skills: ['React', 'TypeScript', 'TailwindCSS', 'Node.js', 'UI/UX Design', 'SEO Optimisation'],
    software: ['VS Code', 'Figma', 'GitHub', 'Vite', 'Vercel'],
    achievements: [
      {
        title: 'Studio Portal',
        description: 'Designed and built the Fun Media Entertainment cinematic-themed studio portal from the ground up.',
      },
    ],
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/sujit-sasmal-4a507923b',
    },
    contactInfo: {
      email: 'web.sujit@funmediaentertainment.com',
    },
    isArtist: false,
  },

  // ── INVESTORS ──────────────────────────────────────────────────────────────
  {
    slug: 'aarav-mehta',
    name: 'Aarav Mehta',
    role: 'Venture Partner & Investor',
    category: 'investors',
    photo: 'https://placehold.co/400x400/1e1e24/6a80ff?text=Aarav+Mehta',
    intro: 'Supporting Fun Media Entertainment\'s strategic growth and vision.',
    bio: 'Aarav Mehta is a Venture Partner and strategic investor supporting media, animation, and technology startups globally. With over 15 years of industry experience, he advises Fun Media Entertainment on business expansion, market positioning, and scaling creative pipelines.',
    experience: [
      {
        title: 'Venture Partner',
        company: 'Alpha Creative Capital',
        period: '2018 – Present',
        description: 'Leads investments in digital media, entertainment hubs, and VFX/Animation production pipelines.',
      },
    ],
    skills: ['Strategic Growth', 'Venture Capital', 'Corporate Expansion', 'Business Planning'],
    software: ['Financial Modeling', 'Excel', 'Strategic Dashboards'],
    achievements: [
      {
        title: 'Expansion Investment',
        description: 'Funded Fun Media Entertainment\'s infrastructure and technical scaling to support larger productions.',
      },
    ],
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/funmedia-entertainment-92b700388',
    },
    isArtist: false,
  },

  // ── CREATIVE ARTISTS ───────────────────────────────────────────────────────
  {
    slug: 'neha-sharma',
    name: 'Neha Sharma',
    role: '3D Modeler',
    category: 'artists',
    photo: 'https://placehold.co/400x400/1e1e24/a855f7?text=Neha+Sharma',
    intro: 'Sculpting highly detailed characters and environment models.',
    bio: 'Neha Sharma is a senior 3D Modeler at Fun Media Entertainment. She specializes in digital sculpting, organic forms, and creating clean, optimized assets ready for game and film pipelines.',
    experience: [
      {
        title: '3D Modeler',
        company: 'Fun Media Entertainment',
        period: '2023 – Present',
        description: 'Models complex character assets, mechanical gear, and high-fidelity environment assets.',
      },
    ],
    skills: ['Character Modeling', 'Organic Sculpting', 'Retopology', 'Hard-Surface Modeling'],
    software: ['ZBrush', 'Autodesk Maya', 'Blender', 'Substance Painter'],
    achievements: [
      {
        title: 'Character Showcase Lead',
        description: 'Sculpted the primary hero character models for upcoming short films.',
      },
    ],
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/funmedia-entertainment-92b700388',
    },
    isArtist: true,
  },
  {
    slug: 'rohan-verma',
    name: 'Rohan Verma',
    role: 'Texture Artist',
    category: 'artists',
    photo: 'https://placehold.co/400x400/1e1e24/a855f7?text=Rohan+Verma',
    intro: 'Bringing surfaces to life with hyper-realistic materials and shaders.',
    bio: 'Rohan Verma is a Texture Artist at Fun Media Entertainment who specializes in hand-painted and PBR texturing techniques. He works to ensure consistent texture resolution, realistic material response, and visual depth across all assets.',
    experience: [
      {
        title: 'Texture Artist',
        company: 'Fun Media Entertainment',
        period: '2023 – Present',
        description: 'Creates high-resolution material libraries, painting custom textures and configuring custom material shaders.',
      },
    ],
    skills: ['PBR Texturing', 'Material Creation', 'UV Mapping', 'Procedural Texturing'],
    software: ['Substance Painter', 'Adobe Photoshop', 'Mari', 'Marmoset Toolbag'],
    achievements: [
      {
        title: 'Procedural Material Library',
        description: 'Designed a reusable library of over 150 procedural textures for faster asset workflows.',
      },
    ],
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/funmedia-entertainment-92b700388',
    },
    isArtist: true,
  },
  {
    slug: 'pooja-patel',
    name: 'Pooja Patel',
    role: '3D Animator',
    category: 'artists',
    photo: 'https://placehold.co/400x400/1e1e24/a855f7?text=Pooja+Patel',
    intro: 'Creating expressive character acting and dynamic action sequences.',
    bio: 'Pooja Patel is a 3D Animator at Fun Media Entertainment. She focuses on body mechanics, character weight, expressive acting beats, and dynamic object locomotion.',
    experience: [
      {
        title: '3D Animator',
        company: 'Fun Media Entertainment',
        period: '2023 – Present',
        description: 'Animates characters and creatures, translating storyboard sketches into fluid, believable movements.',
      },
    ],
    skills: ['Character Animation', 'Locomotion & Mechanics', 'Lip-Sync & Facial Acting', 'Storyboarding'],
    software: ['Autodesk Maya', 'Blender'],
    achievements: [
      {
        title: 'Keyframe Sequence Lead',
        description: 'Animated the complex, high-paced choreographies for the studio\'s flagship project.',
      },
    ],
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/funmedia-entertainment-92b700388',
    },
    isArtist: true,
  },
  {
    slug: 'arjun-rao',
    name: 'Arjun Rao',
    role: '3D Rigger',
    category: 'artists',
    photo: 'https://placehold.co/400x400/1e1e24/a855f7?text=Arjun+Rao',
    intro: 'Engineering robust, user-friendly character and vehicle rigging systems.',
    bio: 'Arjun Rao is a 3D Rigger at Fun Media Entertainment who builds highly flexible rigging frameworks. He integrates custom script utilities to automate animation pipelines and facial setup controls.',
    experience: [
      {
        title: '3D Rigger',
        company: 'Fun Media Entertainment',
        period: '2023 – Present',
        description: 'Develops bone hierarchies, control shapes, deformation networks, and helper tools for animators.',
      },
    ],
    skills: ['Character Rigging', 'Facial Rigging', 'Python Scripting', 'Deformation Setup'],
    software: ['Autodesk Maya', 'Python', 'Blender'],
    achievements: [
      {
        title: 'Facial Rig UI',
        description: 'Created a custom GUI panel plugin for Maya that sped up animator workflows by 25%.',
      },
    ],
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/funmedia-entertainment-92b700388',
    },
    isArtist: true,
  },
  {
    slug: 'deepak-sen',
    name: 'Deepak Sen',
    role: 'Lighting & Rendering Artist',
    category: 'artists',
    photo: 'https://placehold.co/400x400/1e1e24/a855f7?text=Deepak+Sen',
    intro: 'Establishing cinematic mood, colors, and lighting setups.',
    bio: 'Deepak Sen is a Lighting & Rendering Artist at Fun Media Entertainment. He specializes in scene lighting, shader assembly, render optimization, and cinematic color composition.',
    experience: [
      {
        title: 'Lighting & Rendering Artist',
        company: 'Fun Media Entertainment',
        period: '2023 – Present',
        description: 'Establishes color keys, manages light paths, sets up render layers, and delivers final composite passes.',
      },
    ],
    skills: ['Scene Lighting', 'Compositing', 'Shading', 'Render Optimization'],
    software: ['Arnold', 'Autodesk Maya', 'Nuke', 'Adobe After Effects'],
    achievements: [
      {
        title: 'Render Optimization Initiative',
        description: 'Reduced average scene render time by 30% without sacrificing quality through advanced sampling configurations.',
      },
    ],
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/funmedia-entertainment-92b700388',
    },
    isArtist: true,
  },
];

// ─── Artist Works ─────────────────────────────────────────────────────────────

export const artistWorks: ArtistWork[] = [
  // ─── 3D MODELING (5 artists, 1 each) ───
  {
    id: 'modeling-neha',
    artistSlug: 'neha-sharma',
    title: 'Sci-Fi Cyberpunk Mech Suit',
    contribution: 'Lead Character Modeler',
    description: 'A highly detailed cyberpunk mech armor sculpt featuring intricate carbon-fiber panels, dynamic joint hydraulics, and production-ready mesh retopology.',
    software: ['ZBrush', 'Autodesk Maya', 'Substance Painter'],
    category: '3D Modeling',
    thumbnail: 'https://placehold.co/800x600/1e1e24/a855f7?text=Cyberpunk+Mech+Suit',
    images: [
      'https://placehold.co/800x600/1e1e24/a855f7?text=Mech+Suit+Front',
      'https://placehold.co/800x600/1e1e24/35d8ff?text=Mech+Suit+Wireframe',
      'https://placehold.co/800x600/1e1e24/ff6a80?text=Internal+Joint+Details'
    ],
  },
  {
    id: 'modeling-rohan',
    artistSlug: 'rohan-verma',
    title: 'Medieval Knight Armour Sculpt',
    contribution: 'Hard Surface Modeler',
    description: 'A high-poly medieval plate armor model featuring complex hand-carved floral engravings, damage scratches, and fabric undersuit draping.',
    software: ['ZBrush', 'Blender'],
    category: '3D Modeling',
    thumbnail: 'https://placehold.co/800x600/1e1e24/80ff6a?text=Knight+Armour+Model',
    images: [
      'https://placehold.co/800x600/1e1e24/80ff6a?text=Knight+Armour+Render',
      'https://placehold.co/800x600/1e1e24/ffdf6a?text=Engraving+Detail+Sculpt'
    ],
  },
  {
    id: 'modeling-pooja',
    artistSlug: 'pooja-patel',
    title: 'Stylized Fantasy Heroine Model',
    contribution: 'Character Sculptor',
    description: 'Stylized 3D character design focusing on clean appealing silhouettes, stylized hair strands, and optimized topology for expressive squash-and-stretch animation.',
    software: ['Autodesk Maya', 'ZBrush'],
    category: '3D Modeling',
    thumbnail: 'https://placehold.co/800x600/1e1e24/5b8cff?text=Fantasy+Heroine+Model',
    images: [
      'https://placehold.co/800x600/1e1e24/5b8cff?text=Heroine+Sculpt',
      'https://placehold.co/800x600/1e1e24/a855f7?text=Topology+Breakdown'
    ],
  },
  {
    id: 'modeling-arjun',
    artistSlug: 'arjun-rao',
    title: 'Bipedal Robot Warrior Model',
    contribution: 'Hard Surface Modeler',
    description: 'A tactical military droid with customizable weapon attachments, detailed mechanical pistons, and modular armor plates.',
    software: ['Autodesk Maya', 'Substance Painter'],
    category: '3D Modeling',
    thumbnail: 'https://placehold.co/800x600/1e1e24/ff6a80?text=Bipedal+Robot+Model',
    images: [
      'https://placehold.co/800x600/1e1e24/ff6a80?text=Droid+Full+Model',
      'https://placehold.co/800x600/1e1e24/5b8cff?text=Weapon+Attachment+Specs'
    ],
  },
  {
    id: 'modeling-deepak',
    artistSlug: 'deepak-sen',
    title: 'Ancient Dragon Creature Sculpt',
    contribution: 'Creature Modeler',
    description: 'A high-fidelity ancient dragon sculpt with individual horn carvings, complex organic skin scales, and wing membranes.',
    software: ['ZBrush', 'Autodesk Maya'],
    category: '3D Modeling',
    thumbnail: 'https://placehold.co/800x600/1e1e24/a855f7?text=Ancient+Dragon+Sculpt',
    images: [
      'https://placehold.co/800x600/1e1e24/a855f7?text=Dragon+Sculpt+Front',
      'https://placehold.co/800x600/1e1e24/80ff6a?text=Scale+Detailing+Closeup'
    ],
  },

  // ─── TEXTURING (5 artists, 1 each) ───
  {
    id: 'texturing-neha',
    artistSlug: 'neha-sharma',
    title: 'Rusted Gothic Cathedral Textures',
    contribution: 'Environment Lookdev Artist',
    description: 'Procedural textures and material setups for weathered stone walls, dust-covered stained glass windows, and moss-filled wooden benches.',
    software: ['Substance Designer', 'Substance Painter'],
    category: 'Texturing',
    thumbnail: 'https://placehold.co/800x600/1e1e24/ffdf6a?text=Gothic+Cathedral+Textures',
    images: [
      'https://placehold.co/800x600/1e1e24/ffdf6a?text=Weathered+Stone+Shader',
      'https://placehold.co/800x600/1e1e24/35d8ff?text=Stained+Glass+Material'
    ],
  },
  {
    id: 'texturing-rohan',
    artistSlug: 'rohan-verma',
    title: 'Vintage Locomotive Interior Textures',
    contribution: 'Lead Material Artist',
    description: 'PBR texture maps for velvet seats, polished mahogany wood panels, and greasy machinery dials, showcasing decades of operational wear.',
    software: ['Substance Painter', 'Adobe Photoshop', 'Marmoset Toolbag'],
    category: 'Texturing',
    thumbnail: 'https://placehold.co/800x600/1e1e24/a855f7?text=Vintage+Locomotive+Textures',
    images: [
      'https://placehold.co/800x600/1e1e24/a855f7?text=Cab+Interior+Texturing',
      'https://placehold.co/800x600/1e1e24/ff6a80?text=Wood+Ageing+Smart+Material'
    ],
  },
  {
    id: 'texturing-pooja',
    artistSlug: 'pooja-patel',
    title: 'Sci-Fi Laser Gun Weathering',
    contribution: 'Prop Texture Artist',
    description: 'PBR map lookdev on futuristic weapons, detailing heat discoloration on the barrel muzzle, laser emission glow maps, and handle grip friction weathering.',
    software: ['Substance Painter', 'Marmoset Toolbag'],
    category: 'Texturing',
    thumbnail: 'https://placehold.co/800x600/1e1e24/80ff6a?text=Laser+Gun+Weathering',
    images: [
      'https://placehold.co/800x600/1e1e24/80ff6a?text=Laser+Rifle+Textures',
      'https://placehold.co/800x600/1e1e24/ffdf6a?text=Anodized+Metal+Passes'
    ],
  },
  {
    id: 'texturing-arjun',
    artistSlug: 'arjun-rao',
    title: 'Biomechanical Alien Skin Textures',
    contribution: 'Creature Texture Artist',
    description: 'Hand-painted Mari textures creating an iridescent biomechanical texture layer for alien shell surfaces and underlying wet muscle tissues.',
    software: ['Mari', 'Adobe Photoshop', 'Substance Painter'],
    category: 'Texturing',
    thumbnail: 'https://placehold.co/800x600/1e1e24/35d8ff?text=Alien+Skin+Textures',
    images: [
      'https://placehold.co/800x600/1e1e24/35d8ff?text=Iridescent+Scales+CloseUp',
      'https://placehold.co/800x600/1e1e24/ff6a80?text=Roughness+Map+Details'
    ],
  },
  {
    id: 'texturing-deepak',
    artistSlug: 'deepak-sen',
    title: 'Weathered Clockwork Soldier Textures',
    contribution: 'Texture Artist',
    description: 'Detailed brass corrosion, metal rust scratches, and dry-oil leak stains painted procedurally for a clockwork automatons project.',
    software: ['Substance Painter', 'Photoshop'],
    category: 'Texturing',
    thumbnail: 'https://placehold.co/800x600/1e1e24/ff6a80?text=Clockwork+Textures',
    images: [
      'https://placehold.co/800x600/1e1e24/ff6a80?text=Corrosion+Shader+Render',
      'https://placehold.co/800x600/1e1e24/a855f7?text=Roughness+Comparison'
    ],
  },

  // ─── 3D ANIMATION (5 artists, 1 each) ───
  {
    id: 'animation-neha',
    artistSlug: 'neha-sharma',
    title: 'Expressive Actor Dialogue Performance',
    contribution: 'Character Animator',
    description: 'Subtle acting performance shot focusing on facial gestures, eye darting, micro-expression shifts, and upper body posture balance during a monologue.',
    software: ['Autodesk Maya'],
    category: '3D Animation',
    thumbnail: 'https://placehold.co/800x600/1e1e24/ff6a80?text=Dialogue+Acting+Animation',
    images: [
      'https://placehold.co/800x600/1e1e24/ff6a80?text=Dialogue+Acting+Shot',
      'https://placehold.co/800x600/1e1e24/5b8cff?text=Audio-Sync+Timelines'
    ],
  },
  {
    id: 'animation-rohan',
    artistSlug: 'rohan-verma',
    title: 'Locomotion Run-Jump Cycle Showcase',
    contribution: 'Technical Animator',
    description: 'A study in weight distribution and secondary animation showing seamless transitions between walks, runs, leaps, and heavy landings.',
    software: ['Autodesk Maya', 'Blender'],
    category: '3D Animation',
    thumbnail: 'https://placehold.co/800x600/1e1e24/5b8cff?text=Run+Jump+Locomotion',
    images: [
      'https://placehold.co/800x600/1e1e24/5b8cff?text=Cycle+Frames',
      'https://placehold.co/800x600/1e1e24/80ff6a?text=Contact+Pose+Breakdown'
    ],
  },
  {
    id: 'animation-pooja',
    artistSlug: 'pooja-patel',
    title: 'Dynamic Sword & Shield Fight Sequence',
    contribution: 'Lead Character Animator',
    description: 'Choreographed a dual combat cutscene. Strong silhouettes, realistic weight shifts, anticipation framing, and physics-driven weapon trails.',
    software: ['Autodesk Maya'],
    category: '3D Animation',
    thumbnail: 'https://placehold.co/800x600/1e1e24/a855f7?text=Combat+Fight+Sequence',
    images: [
      'https://placehold.co/800x600/1e1e24/a855f7?text=Combat+Keyframes',
      'https://placehold.co/800x600/1e1e24/5b8cff?text=Action-Stance+Poses'
    ],
  },
  {
    id: 'animation-arjun',
    artistSlug: 'arjun-rao',
    title: 'Parkour Vaulting Motion Test',
    contribution: 'Technical Animator',
    description: 'Hand-keyed acrobatic gymnastics cycle showcasing body momentum preservation, hand-plant rotations, and realistic knee damping.',
    software: ['Autodesk Maya'],
    category: '3D Animation',
    thumbnail: 'https://placehold.co/800x600/1e1e24/80ff6a?text=Parkour+Vaulting',
    images: [
      'https://placehold.co/800x600/1e1e24/80ff6a?text=Vault+Apex+Pose',
      'https://placehold.co/800x600/1e1e24/ffdf6a?text=Motion-Path+Curves'
    ],
  },
  {
    id: 'animation-deepak',
    artistSlug: 'deepak-sen',
    title: 'Heavy Vehicle Stunt & Drift Sequence',
    contribution: 'Layout Animator',
    description: 'Pre-visualized stunt dynamics showing a military buggy drifting on sand, featuring camera shakes and tire slip angle adjustments.',
    software: ['Autodesk Maya', 'Unreal Engine'],
    category: '3D Animation',
    thumbnail: 'https://placehold.co/800x600/1e1e24/a855f7?text=Vehicle+Drift+Animation',
    images: [
      'https://placehold.co/800x600/1e1e24/a855f7?text=Drift+Sequence+Shot',
      'https://placehold.co/800x600/1e1e24/35d8ff?text=Camera+Previs+Paths'
    ],
  },

  // ─── RIGGING (5 artists, 1 each) ───
  {
    id: 'rigging-neha',
    artistSlug: 'neha-sharma',
    title: 'Facial Expressions Controller Setup',
    contribution: 'Facial Technical Artist',
    description: 'Hybrid muscle-joint facial rig script designed in Maya, using micro-controller pickers to allow facial action coding systems (FACS) styling.',
    software: ['Autodesk Maya', 'Python'],
    category: 'Rigging',
    thumbnail: 'https://placehold.co/800x600/1e1e24/ff6a80?text=Facial+Rigging+GUI',
    images: [
      'https://placehold.co/800x600/1e1e24/ff6a80?text=Facial+Sliders+Panel',
      'https://placehold.co/800x600/1e1e24/5b8cff?text=Mouth+Deformation+Grid'
    ],
  },
  {
    id: 'rigging-rohan',
    artistSlug: 'rohan-verma',
    title: 'Bird Wing Fold & Flap Rig',
    contribution: 'Technical Director',
    description: 'A procedural feather wing rig that automatically coordinate primary/secondary feathers to overlap and fan out based on wingspan velocity.',
    software: ['Autodesk Maya', 'Python'],
    category: 'Rigging',
    thumbnail: 'https://placehold.co/800x600/1e1e24/a855f7?text=Bird+Flight+Rig',
    images: [
      'https://placehold.co/800x600/1e1e24/a855f7?text=Wing+Bones+Setup',
      'https://placehold.co/800x600/1e1e24/ff6a80?text=Feather+Collision+Nodes'
    ],
  },
  {
    id: 'rigging-pooja',
    artistSlug: 'pooja-patel',
    title: 'Stretchy Cartoon Character Rig',
    contribution: 'Rigger',
    description: 'Expressive cartoon rig built for fast acting beats, containing stretchable spine, auto-overlapping ribbons, and eye tracking nodes.',
    software: ['Autodesk Maya'],
    category: 'Rigging',
    thumbnail: 'https://placehold.co/800x600/1e1e24/80ff6a?text=Cartoon+Stretchy+Rig',
    images: [
      'https://placehold.co/800x600/1e1e24/80ff6a?text=Deformation+Stress+Check',
      'https://placehold.co/800x600/1e1e24/ffdf6a?text=Ribbon+Spline+Setups'
    ],
  },
  {
    id: 'rigging-arjun',
    artistSlug: 'arjun-rao',
    title: 'Advanced Quadruped Dragon Rig',
    contribution: 'Lead Rigging Artist',
    description: 'Created a highly flexible deformation rig for a mystical dragon creature. Integrated dynamic secondary motion on wings, custom muscle squashing, and procedural tail controls.',
    software: ['Autodesk Maya', 'Python'],
    category: 'Rigging',
    thumbnail: 'https://placehold.co/800x600/1e1e24/a855f7?text=Dragon+Creature+Rig',
    images: [
      'https://placehold.co/800x600/1e1e24/a855f7?text=Dragon+Controls+Overview',
      'https://placehold.co/800x600/1e1e24/80ff6a?text=Rig+Picker+HUD'
    ],
  },
  {
    id: 'rigging-deepak',
    artistSlug: 'deepak-sen',
    title: 'Mechanical Excavator Hydraulic Rig',
    contribution: 'Rigging Artist',
    description: 'Vehicle rig focused on automatic hydraulic cylinder expansions, metal tread belt traction, and rotational cabin pivots.',
    software: ['Autodesk Maya', 'Expressions'],
    category: 'Rigging',
    thumbnail: 'https://placehold.co/800x600/1e1e24/5b8cff?text=Hydraulic+Excavator+Rig',
    images: [
      'https://placehold.co/800x600/1e1e24/5b8cff?text=Piston+Pivots',
      'https://placehold.co/800x600/1e1e24/a855f7?text=Tread+Friction+Controller'
    ],
  },

  // ─── PRODUCT LIGHTING & RENDERING (5 artists, 1 each) ───
  {
    id: 'lighting-neha',
    artistSlug: 'neha-sharma',
    title: 'Premium Chronograph Wristwatch Showcase',
    contribution: 'Lighting & Shading Artist',
    description: 'Studio product shot utilizing macro lenses, polarized lights, and brushed metal shaders to highlight gold bezel textures.',
    software: ['Arnold', 'Autodesk Maya', 'Photoshop'],
    category: 'Product Lighting & Rendering',
    thumbnail: 'https://placehold.co/800x600/1e1e24/a855f7?text=Chronograph+Watch+Render',
    images: [
      'https://placehold.co/800x600/1e1e24/a855f7?text=Polarized+Studio+Setup',
      'https://placehold.co/800x600/1e1e24/35d8ff?text=Glass+Refraction+Pass'
    ],
  },
  {
    id: 'lighting-rohan',
    artistSlug: 'rohan-verma',
    title: 'Vintage Leather Shoe Product Render',
    contribution: 'Lighting & Lookdev Artist',
    description: 'High-contrast studio display highlighting the micro-fibres of stitching threads and glossy leather reflections under softbox configurations.',
    software: ['KeyShot', 'Substance Painter'],
    category: 'Product Lighting & Rendering',
    thumbnail: 'https://placehold.co/800x600/1e1e24/5b8cff?text=Leather+Shoe+Render',
    images: [
      'https://placehold.co/800x600/1e1e24/5b8cff?text=Softbox+Lighting+Arrangement',
      'https://placehold.co/800x600/1e1e24/80ff6a?text=Bump+Mapping+Fidelity'
    ],
  },
  {
    id: 'lighting-pooja',
    artistSlug: 'pooja-patel',
    title: 'High-End Wireless Headphones Packshot',
    contribution: 'Lighting Artist',
    description: 'Cinematic turntable rendering with vibrant key-light color contrasts to promote wireless metal band reflections and matte earcups.',
    software: ['Arnold', 'Autodesk Maya', 'Nuke'],
    category: 'Product Lighting & Rendering',
    thumbnail: 'https://placehold.co/800x600/1e1e24/ffdf6a?text=Wireless+Headphones+Render',
    images: [
      'https://placehold.co/800x600/1e1e24/ffdf6a?text=Vibrant+Rimlight+Setup',
      'https://placehold.co/800x600/1e1e24/35d8ff?text=Depth+Of+Field+Focus'
    ],
  },
  {
    id: 'lighting-arjun',
    artistSlug: 'arjun-rao',
    title: 'Ergonomic Sports Sunglasses Render',
    contribution: 'Rendering Technical Director',
    description: 'Studio rendering focusing on complex transparent plastic refractions and gradient polarized lens shaders.',
    software: ['Arnold', 'Autodesk Maya'],
    category: 'Product Lighting & Rendering',
    thumbnail: 'https://placehold.co/800x600/1e1e24/35d8ff?text=Sports+Sunglasses+Render',
    images: [
      'https://placehold.co/800x600/1e1e24/35d8ff?text=GradientLens+Reflections',
      'https://placehold.co/800x600/1e1e24/ff6a80?text=Fresnel+Shading+Pass'
    ],
  },
  {
    id: 'lighting-deepak',
    artistSlug: 'deepak-sen',
    title: 'Sci-Fi Energy Drink Flask Render',
    contribution: 'Lead Lighting & Rendering Artist',
    description: 'Crafted scene lighting for a metal alloy energy canister. Balanced neon emissive details with volumetric water condensation and atmospheric backlights.',
    software: ['Arnold', 'Nuke', 'Autodesk Maya'],
    category: 'Product Lighting & Rendering',
    thumbnail: 'https://placehold.co/800x600/1e1e24/a855f7?text=Energy+Flask+Lighting',
    images: [
      'https://placehold.co/800x600/1e1e24/a855f7?text=Condensation+Closeup',
      'https://placehold.co/800x600/1e1e24/5b8cff?text=Atmosphere+Volumetric+AOV'
    ],
  },

  // ─── 2D ANIMATION (5 artists, 1 each) ───
  {
    id: '2d-animation-neha',
    artistSlug: 'neha-sharma',
    title: 'Expressive 2D Character Walk Cycle',
    contribution: '2D Animator',
    description: 'Smooth and bouncy walk cycle for a cartoon protagonist, focusing on weight, personality, and squash-and-stretch principles in a frame-by-frame 2D style.',
    software: ['Toon Boom Harmony', 'Adobe Animate'],
    category: '2D Animation',
    subcategory: 'Character Animation',
    thumbnail: 'https://placehold.co/800x600/1e1e24/35d8ff?text=2D+Walk+Cycle',
    images: [
      'https://placehold.co/800x600/1e1e24/35d8ff?text=Walk+Cycle+Frames',
      'https://placehold.co/800x600/1e1e24/a855f7?text=Timing+Charts',
    ],
  },
  {
    id: '2d-animation-rohan',
    artistSlug: 'rohan-verma',
    title: 'Animated Promotional Explainer Video',
    contribution: '2D Motion Designer',
    description: 'A fully animated 60-second explainer video combining kinetic typography, icon animations, and illustrated character beats for a product launch campaign.',
    software: ['Adobe After Effects', 'Illustrator'],
    category: '2D Animation',
    subcategory: 'Motion Graphics',
    thumbnail: 'https://placehold.co/800x600/1e1e24/35d8ff?text=Explainer+Video',
    images: [
      'https://placehold.co/800x600/1e1e24/35d8ff?text=Explainer+Storyboard',
      'https://placehold.co/800x600/1e1e24/6a80ff?text=Typography+Anim+Frames',
    ],
  },
  {
    id: '2d-animation-pooja',
    artistSlug: 'pooja-patel',
    title: 'Storyboard & Animatic — Chase Scene',
    contribution: '2D Storyboard Artist & Animator',
    description: 'Full animatic for a high-energy chase sequence — rough poses, panel layouts, and rough timing locked off before production, demonstrating clear storytelling instincts.',
    software: ['Storyboard Pro', 'Toon Boom Harmony'],
    category: '2D Animation',
    subcategory: 'Animatic',
    thumbnail: 'https://placehold.co/800x600/1e1e24/35d8ff?text=Chase+Animatic',
    images: [
      'https://placehold.co/800x600/1e1e24/35d8ff?text=Storyboard+Panels',
      'https://placehold.co/800x600/1e1e24/ffdf6a?text=Rough+Pose+Keys',
    ],
  },
  {
    id: '2d-animation-arjun',
    artistSlug: 'arjun-rao',
    title: 'Frame-by-Frame Fighting Action Short',
    contribution: 'Lead 2D Animator',
    description: 'A dynamic 2D action sequence animated frame-by-frame showcasing impact frames, smear drawings, and fluid motion blur trails for an anime-style fight short.',
    software: ['Adobe Animate', 'Clip Studio Paint'],
    category: '2D Animation',
    subcategory: 'Action Animation',
    thumbnail: 'https://placehold.co/800x600/1e1e24/35d8ff?text=2D+Fight+Short',
    images: [
      'https://placehold.co/800x600/1e1e24/35d8ff?text=Smear+Frames',
      'https://placehold.co/800x600/1e1e24/ff6a80?text=Impact+Keyframes',
    ],
  },
  {
    id: '2d-animation-deepak',
    artistSlug: 'deepak-sen',
    title: 'Looping 2D Character Idle Animation',
    contribution: '2D Game Animator',
    description: 'Seamless idle loop for a 2D game character — breathing movement, subtle eye blinks, and cloth sway blended into a polished, game-ready sprite sheet.',
    software: ['Spine 2D', 'Adobe Photoshop'],
    category: '2D Animation',
    subcategory: 'Game Animation',
    thumbnail: 'https://placehold.co/800x600/1e1e24/35d8ff?text=2D+Idle+Loop',
    images: [
      'https://placehold.co/800x600/1e1e24/35d8ff?text=Sprite+Sheet+Preview',
      'https://placehold.co/800x600/1e1e24/80ff6a?text=Spine+Rig+Layers',
    ],
  },
];

// ─── Helper Functions ─────────────────────────────────────────────────────────

export function getCrewMember(slug: string): CrewMemberFull | undefined {
  return crewMembers.find((m) => m.slug === slug);
}

export function getArtistWorks(artistSlug: string): ArtistWork[] {
  return artistWorks.filter((w) => w.artistSlug === artistSlug);
}

export function getCrewByCategory(category: CrewCategory): CrewMemberFull[] {
  return crewMembers.filter((m) => m.category === category);
}

