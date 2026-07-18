// Team SSOT — non-localized member data. Name/role/bio live in i18n dictionaries.

export interface TeamMember {
  id: string;
  imageSrc: string;
  linkedin: string;
}

export const TEAM: TeamMember[] = [
  {
    id: "gahyun",
    imageSrc: "/team/gahyun.jpg",
    linkedin: "https://www.linkedin.com/in/otti-nuna/",
  },
  {
    id: "eunkwang",
    imageSrc: "/team/eunkwang.jpg",
    linkedin: "https://www.linkedin.com/in/gracefullight/",
  },
];
