import type { Metadata } from "next";
import EventForm from "../_components/EventForm";

export const metadata: Metadata = { title: "New event" };

export default function NewEventPage() {
    return <EventForm />;
}
