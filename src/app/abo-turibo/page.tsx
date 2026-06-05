import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import { getPage } from "@/lib/pages";
import SectionPage from "@/components/SectionPage";

const FALLBACK = {
    title: "Ijambo Ryikaze",
    subtitle: "IJAMBO RYIKAZE (RUBRIQUE)",
    description: "Urugero Gospel News ni urubuga rwanyu, rugamije kubaha ijambo no kubagezaho amakuru y'ukuri.",
    icon: "👥",
    color: "#1F1F1F",
    hero: "https://images.unsplash.com/photo-1529156069898-49953eb1b5ce?q=80&w=1400&auto=format&fit=crop",
};

export const revalidate = 60;

function WelcomeRubrique() {
    return (
        <article aria-labelledby="ijambo-ryikaze">
            <h2 id="ijambo-ryikaze">IKAZE</h2>

            <p>Yesu ashimwe basomyi bacu bose!</p>

            <p>
                Ni ibyishimo bikomeye kongera kubandikira binyuze kuri Urugero Gospel News,
                urubuga twashyizeho tubazirikana, tubagirira urukundo n&apos;icyubahiro, ndetse
                tunabifuriza gukomeza kugira amahoro n&apos;imigisha ituruka ku Mana.
            </p>

            <p>
                Impamvu y&apos;iyi nyandiko ni ukubamenyesha ko uru rubuga Urugero Gospel News
                rwashyizweho by&apos;umwihariko kubwanyu.
            </p>

            <p>
                Ni urubuga rwanyu, rugamije kubaha ijambo, kubagezaho amakuru y&apos;ukuri, no
                gufasha kumenyekanisha ibikorwa byiza byose bifite aho bihuriye n&apos;iyobokamana
                n&apos;iterambere.
            </p>

            <p>
                Urugero Gospel News irashimangira ko ari igitangazamakuru kidashyiraho imipaka
                ku muntu uwo ari we wese, yaba itorero, idini, umuryango wa Gikristo, cyangwa
                imiryango itegamiye kuri Leta ikora ibikorwa by&apos;ivugabutumwa, gufasha no guteza
                imbere imibereho myiza y&apos;abantu.
            </p>

            <p>
                Uru rubuga ruzakomeza kuba ijwi rihuza, rihuza imirimo myiza yose ikorerwa mu
                matorero, mu bitaramo by&apos;ivugabutumwa, gahunda z&apos;amasengesho, ibikorwa
                by&apos;ubufasha n&apos;indi mishinga igamije kubaka umuryango wa Gikristo.
            </p>

            <blockquote>
                <p>Urugero Gospel News ni urubuga rw&apos;abantu bose.</p>
                <p>
                    Nta mupaka dushyira ku muntu uwo ari we wese igihe ibikorwa bye bigamije
                    iyobokamana, iterambere n&apos;imirimo y&apos;urukundo.
                </p>
            </blockquote>

            <blockquote>
                <p>Hamwe n&apos;itsinda rigari ry&apos;abakozi ba Urugero Gospel News, duhari amasaha yose kubwanyu.</p>
            </blockquote>

            <p>
                Turabashishikariza buri wese ufite ibikorwa byiza kubitugeraho kugira ngo tubifashe
                kubigeza ku bantu benshi kurushaho.
            </p>

            <p>
                <strong>
                    <a href="https://www.urugerogospelnews.com/abo-turibo">Arnau Ntamvutsa</a>
                </strong>
                <br />
                Umuyobozi wa Urugero Media Group/Urugero gospel news.com
            </p>
        </article>
    );
}

export async function generateMetadata(): Promise<Metadata> {
    const page = await getPage("abo-turibo");
    return buildMeta({
        title: page?.title ?? FALLBACK.title,
        description: page?.subtitle || FALLBACK.description,
        path: "/abo-turibo",
    });
}

export default async function AboTuriboPage() {
    const page = await getPage("abo-turibo");
    return (
        <SectionPage
            title={page?.title ?? FALLBACK.title}
            subtitle={page?.subtitle || FALLBACK.subtitle}
            description={FALLBACK.description}
            icon={page?.icon ?? FALLBACK.icon}
            color={page?.color ?? FALLBACK.color}
            heroImage={page?.hero_image ?? FALLBACK.hero}
        >
            <WelcomeRubrique />
            {page?.content && <div dangerouslySetInnerHTML={{ __html: page.content }} />}
        </SectionPage>
    );
}
