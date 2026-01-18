import { createAvatar } from "@dicebear/core";
import { botttsNeutral, initials } from "@dicebear/collection";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
interface GeneratedAvatarProps {
  seed: string;
  classname?: string;
  variant: "botttsNeutral" | "initials";
}

export const AiAvatar = ({
  seed,
  classname,
  variant,
}: GeneratedAvatarProps) => {
  let avatar;
  if (variant === "botttsNeutral") {
    avatar = createAvatar(botttsNeutral, { seed });
  } else {
    avatar = createAvatar(initials, { seed, fontWeight: 500, fontSize: 42 });
  }

  return (
    <Avatar className={cn(classname)}>
      <AvatarImage src={avatar.toDataUri()} alt="Avatar" />
      <AvatarFallback>
        <Image
          src="/logo.png"
          height={50}
          width={50}
          alt="Company Logo"
          className="object-cover w-full h-full invert"
        />
      </AvatarFallback>
    </Avatar>
  );
};