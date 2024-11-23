"use client";
import { cn } from "@utils/common";
import { useEffect, useRef, useState } from "react";

export default function NumberTicker({
    value,
    direction = "up",
    delay = 0,
    className,
    decimalPlaces = 0,
}: {
    value: number;
    direction?: "up" | "down";
    className?: string;
    delay?: number; // delay in s
    decimalPlaces?: number;
}) {
    const ref = useRef<HTMLSpanElement>(null);
    const startValue = useRef<number>(direction === "down" ? value : 0);
    const targetValue = direction === "down" ? 0 : value;

    const [isInView, setIsInView] = useState(false); // State to track visibility

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect(); // Disconnect once it becomes visible
                }
            },
            { threshold: 0.1 } // Trigger when at least 10% is visible
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!isInView) return; // Start ticker only if component is in view

        let frameId: number;
        let start: number | null = null;
        const duration = 1000; // Animation duration in ms

        const tick = (timestamp: number) => {
            if (!start) start = timestamp;
            const elapsed = timestamp - start;
            const progress = Math.min(elapsed / duration, 1);

            // Calculate currentValue based on direction
            const currentValue =
                direction === "down"
                    ? startValue.current - (startValue.current * progress) // Counts down to 0
                    : (targetValue * progress); // Counts up to the target value

            // Ensure currentValue doesn't go below 0 for the down direction
            const finalValue = direction === "down" ? Math.max(currentValue, 0) : currentValue;

            if (ref.current) {
                ref.current.textContent = Intl.NumberFormat("en-US", {
                    minimumFractionDigits: decimalPlaces,
                    maximumFractionDigits: decimalPlaces,
                }).format(finalValue);
            }

            if (progress < 1) {
                frameId = requestAnimationFrame(tick);
            }
        };

        const timeout = setTimeout(() => {
            startValue.current = value; // Reset startValue based on direction
            requestAnimationFrame(tick);
        }, delay * 1000);

        return () => {
            clearTimeout(timeout);
            cancelAnimationFrame(frameId);
        };
    }, [value, direction, delay, isInView, decimalPlaces]);

    return (
        <span
            className={cn(
                "inline-block tabular-nums text-black",
                className
            )}
            ref={ref}
        />
    );
}