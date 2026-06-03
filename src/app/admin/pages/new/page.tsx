import type { Metadata } from "next";
import PageForm from "../_components/PageForm";

export const metadata: Metadata = { title: "New page" };

export default function NewPagePage() {
    return <PageForm />;
}
