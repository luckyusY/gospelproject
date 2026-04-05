import SectionPage from "@/components/SectionPage";

export default function OnlineRadioPage() {
    return (
        <SectionPage
            title="Urugero Online Radio"
            subtitle="URUGERO MEDIA GROUP"
            description="Urugero Online Radio isakaza amajwi y'Imana buri munsi binyuze mu mishya, inyigisho n'indirimbo z'Imana."
            icon="📻"
            color="#F59E0B"
            breadcrumb={[{ label: "Urugero Media Group", href: "/urugero-media-group" }]}
            subSections={[
                { label: "Shows", href: "/urugero-media-group/online-radio", desc: "Gahunda za radio" },
                { label: "Music", href: "/urugero-media-group/online-radio", desc: "Indirimbo z'Imana" },
                { label: "Teaching", href: "/urugero-media-group/online-radio", desc: "Inyigisho kuri radio" },
            ]}
        />
    );
}
