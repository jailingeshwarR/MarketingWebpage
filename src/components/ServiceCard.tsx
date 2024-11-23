import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@utils/common";

interface ServiceCardProps {
    title: string;
    description: string;
    imageUrl: string;
    className?: string;
}

export function ServiceCard({ title, description, imageUrl, className }: ServiceCardProps) {
    return (
        <Card className={cn(
            "group relative overflow-hidden border-0 bg-black/50 backdrop-blur-xl transition-all duration-500 hover:scale-[1.02]",
            className
        )}>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80" />
            <div className="absolute inset-0">
                <img
                    src={imageUrl}
                    alt={title}
                    title={title}
                    draggable={false}
                    loading="lazy"
                    className="h-full w-full object-cover bg-top opacity-80 transition-all duration-500 group-hover:scale-110"
                />
            </div>

            <CardHeader className="relative p-0">
                <img
                    src={imageUrl}
                    alt={title}
                    title={title}
                    draggable={false}
                    loading="lazy"
                    className="h-64 w-full object-cover opacity-100 transition-all duration-500"
                />
            </CardHeader>
            <CardContent className="relative space-y-4 bg-black/5  backdrop-blur-md pt-6">
                <CardTitle className="text-xl font-semibold tracking-tight text-white">{title}</CardTitle>
                <CardDescription className="text-base text-white/80">
                    {description}
                </CardDescription>
                <Button variant="outline" className="group/button border-white/20 text-white backdrop-blur-lg">
                    Explore
                    <ArrowUpRight className="ml-2 h-4 w-4 transition-all group-hover/button:-translate-y-1 group-hover/button:translate-x-1" />
                </Button>
            </CardContent>
        </Card>
    );
}