import SectionPage from "@/components/SectionPage";

export default function BibleQuizPage() {
    return (
        <SectionPage
            title="Urugero Bible Quiz"
            subtitle="URUGERO MEDIA GROUP"
            description="Urugero Bible Quiz iteranya amashuri, amatorero na YouTube mu gukora ibibazo bya Bibiliya."
            icon="📖"
            color="#F59E0B"
            breadcrumb={[{ label: "Urugero Media Group", href: "/urugero-media-group" }]}
            subSections={[
                { label: "Schools", href: "/urugero-media-group/bible-quiz", desc: "Bible Quiz mu mashuri" },
                { label: "Churches", href: "/urugero-media-group/bible-quiz", desc: "Bible Quiz mu amatorero" },
                { label: "YouTube Program", href: "/urugero-media-group/bible-quiz", desc: "Bible Quiz kuri YouTube" },
            ]}
        />
    );
}
