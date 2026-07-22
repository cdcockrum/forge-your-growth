import {
  BookOpen,
  Compass,
  Hammer,
  Home,
  User,
} from "lucide-react";

import { Link } from "@tanstack/react-router";

const navigation = [
  {
    title: "Today",
    icon: Home,
    to: "/today",
  },
  {
    title: "Practice",
    icon: Hammer,
    to: "/plan",
  },
  {
    title: "Journey",
    icon: Compass,
    to: "/story",
  },
  {
    title: "Discover",
    icon: BookOpen,
    to: "/dashboard",
  },
  {
    title: "Profile",
    icon: User,
    to: "/vision",
  },
];

export function ForgeNavigation() {
  return (
    <nav className="space-y-2">
      {navigation.map((item) => {
        const Icon = item.icon;

        return (
          <Link
            key={item.to}
            to={item.to}
            activeProps={{
              className:
                "bg-primary text-primary-foreground",
            }}
            className="flex items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-muted"
          >
            <Icon className="h-5 w-5" />

            <span className="font-medium">
              {item.title}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}