import type { Metadata } from "next";
import TestimonyForm from "../_components/TestimonyForm";

export const metadata: Metadata = { title: "New testimony" };

export default function NewTestimonyPage() {
    return <TestimonyForm />;
}
