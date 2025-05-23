import { DivideIcon as LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FeatureCardProps {
  icon: typeof LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  className,
}: FeatureCardProps) {
  return (
    <Card className="group border-border bg-card border transition-all duration-300 hover:scale-105 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:shadow-lg">
      <div className="bg-card m-0.5 -my-5.5 rounded-[calc(1.5rem-12px)] bg-clip-padding px-5 py-7 md:px-10 md:py-10">
        <CardHeader className="pb-2">
          <div className="bg-card mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500/15 to-purple-500/15 transition-colors group-hover:from-blue-500/60 group-hover:to-purple-500/60 group-hover:text-white">
            <Icon />
          </div>
          <CardTitle className="text-xl transition-colors">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{description}</p>
        </CardContent>
      </div>
    </Card>
  );
}
