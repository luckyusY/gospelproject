import type { Metadata } from "next";
import TestimonyForm from "../_components/TestimonyForm";

export const metadata: Metadata = { title: "Ubuhamya bushya" };

export default function NewTestimonyPage() {
    return <TestimonyForm />;
}
