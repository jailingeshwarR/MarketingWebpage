import { cn } from "@utils/common";

interface MarqueeProps {
    className?: string;
    pauseOnHover?: boolean;
    children?: React.ReactNode;
    direction?: "left" | "right" | "top" | "bottom";
    duration?: string;
    repeat?: number;
    [key: string]: any;
}

export default function MarqueeWrapper({
    className,
    pauseOnHover = false,
    children,
    direction = "left",
    duration = "40s",
    repeat = 4,
  ...props
}: MarqueeProps) {
    const vertical = direction === "top" || direction === "bottom";
    const reverse = direction === "right" || direction === "bottom";

    return (
        <div
            {...props}
            className={cn(
                "group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]",
                {
                    "flex-row": !vertical,
                    "flex-col": vertical,
                },
                className,
            )}
            style={{ "--duration": duration } as React.CSSProperties} // Explicitly cast style object to React.CSSProperties
        >
            {Array(repeat)
                .fill(0)
                .map((_, i) => (
                    <div
                        key={i}
                        className={cn("flex shrink-0 justify-around [gap:var(--gap)]", {
                            "animate-marquee flex-row": !vertical,
                            "animate-marquee-vertical flex-col": vertical,
                            "group-hover:[animation-play-state:paused]": pauseOnHover,
                            "[animation-direction:reverse]": reverse,
                        })}
                    >
                        {children}
                    </div>
                ))}
        </div>
    );
}