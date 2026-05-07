import {
  Instagram,
  Twitter,
  Youtube,
  Twitch,
  Facebook,
  Github,
  Globe,
  Music2,
  MessageCircle,
  Cloud,
} from "lucide-react";

interface Props {
  links: string[];
  size?: "sm" | "md";
}

type Platform = {
  name: string;
  Icon: typeof Instagram;
  match: RegExp;
};

const PLATFORMS: Platform[] = [
  { name: "Instagram", Icon: Instagram, match: /instagram\.com|instagr\.am/i },
  { name: "X / Twitter", Icon: Twitter, match: /(?:^|\/\/)(?:www\.)?(?:x\.com|twitter\.com)/i },
  { name: "YouTube", Icon: Youtube, match: /youtube\.com|youtu\.be/i },
  { name: "Twitch", Icon: Twitch, match: /twitch\.tv/i },
  { name: "TikTok", Icon: Music2, match: /tiktok\.com/i },
  { name: "Bluesky", Icon: Cloud, match: /bsky\.app|bluesky/i },
  { name: "Facebook", Icon: Facebook, match: /facebook\.com|fb\.com/i },
  { name: "Discord", Icon: MessageCircle, match: /discord\.(?:gg|com)/i },
  { name: "GitHub", Icon: Github, match: /github\.com/i },
];

const detect = (url: string): Platform => {
  for (const p of PLATFORMS) if (p.match.test(url)) return p;
  return { name: "Site", Icon: Globe, match: /./ };
};

const AuthorSocials = ({ links, size = "md" }: Props) => {
  const valid = (links || [])
    .map((l) => (l || "").trim())
    .filter((l) => /^https?:\/\//i.test(l))
    .slice(0, 3);

  if (!valid.length) return null;

  const dim = size === "sm" ? "w-8 h-8" : "w-9 h-9";
  const iconDim = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";

  return (
    <div className="flex items-center gap-2">
      {valid.map((url) => {
        const { name, Icon } = detect(url);
        return (
          <a
            key={url}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={name}
            title={name}
            className={`group inline-flex items-center justify-center ${dim} rounded-full bg-primary/10 border border-primary/30 text-primary-glow transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:border-primary-glow hover:shadow-[0_0_18px_hsl(var(--primary-glow)/0.6)] hover:-translate-y-0.5`}
          >
            <Icon className={`${iconDim} transition-transform duration-300 group-hover:scale-110`} />
          </a>
        );
      })}
    </div>
  );
};

export default AuthorSocials;
