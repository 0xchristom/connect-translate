import { createFileRoute } from "@tanstack/react-router";
import { Phrasebook } from "@/components/phrasebook";

export const Route = createFileRoute("/")({ component: Phrasebook });
