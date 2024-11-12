import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import styles from "./style.module.scss";

type ButtonVariant = "red" | "blue" | "green" | "gray";

interface CardTagProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
  defaultActive?: boolean;
}

function getContentLength(content: React.ReactNode): number {
  if (typeof content === "string") {
    return Array.from(content).length;
  }
  return 0;
}

function getSizeClass(length: number): string {
  if (length <= 3) return styles.cardSmall;
  if (length <= 5) return styles.cardMedium;
  return styles.cardLarge;
}

function formatContent(children: React.ReactNode): React.ReactNode {
  if (typeof children !== "string") {
    return children;
  }

  const contentLength = getContentLength(children);
  if (contentLength > 8) {
    return `${Array.from(children).slice(0, 8).join("")}...`;
  }
  return children;
}

const CardTag: React.FC<CardTagProps> = ({
  variant = "red",
  children,
  className,
  defaultActive = false,
  onClick,
  ...props
}) => {
  const [isActive, setIsActive] = useState(defaultActive);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setIsActive(!isActive);
    onClick?.(event);
  };

  const contentLength = getContentLength(children);
  const sizeClass = getSizeClass(contentLength);
  const formattedContent = formatContent(children);

  return (
    <Button
      variant="ghost"
      className={cn(
        styles.card_tag,
        styles[variant],
        sizeClass,
        isActive && styles.active,
        className,
      )}
      onClick={handleClick}
      {...props}
    >
      {formattedContent}
    </Button>
  );
};

export default CardTag;
