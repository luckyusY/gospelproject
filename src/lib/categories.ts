import type { SupabaseClient } from "@supabase/supabase-js";
import type { CategoryInsert, CategoryRow, Database } from "@/types/database";

export type ArticleCategoryOption = {
    slug: string;
    name: string;
    color: string;
    nav_group: string | null;
    sort_order: number;
};

type CategorySeed = Pick<CategoryInsert, "name" | "slug" | "color" | "nav_group" | "sort_order">;

const DEFAULT_ARTICLE_CATEGORY_SEEDS: CategorySeed[] = [
    { name: "Abahanzi", slug: "abahanzi", color: "#7C3AED", nav_group: "amakuru", sort_order: 0 },
    { name: "Amakorali", slug: "amakorali", color: "#059669", nav_group: "amakuru", sort_order: 1 },
    { name: "Amatorero", slug: "amatorero", color: "#1E40AF", nav_group: "amakuru", sort_order: 2 },
    { name: "Abanyempano", slug: "abanyempano", color: "#DC2626", nav_group: "amakuru", sort_order: 3 },
    { name: "Ibitaramo", slug: "ibitaramo", color: "#F59E0B", nav_group: "amakuru", sort_order: 4 },
    { name: "Sport", slug: "sport", color: "#047857", nav_group: "amakuru", sort_order: 5 },
    { name: "Hanze y'u Rwanda", slug: "hanze-yu-rwanda", color: "#0D1B2E", nav_group: "amakuru", sort_order: 6 },
    { name: "Inkuru yanjye", slug: "inkuru-yanjye", color: "#B80000", nav_group: "amakuru", sort_order: 7 },
    { name: "Ibaruwa", slug: "ibaruwa", color: "#7C2D12", nav_group: "amakuru", sort_order: 8 },
    { name: "Tumenye Bibiliya", slug: "tumenye-bibiliya", color: "#1E40AF", nav_group: "tumenye-bibiliya", sort_order: 0 },
];

const DEFAULT_CATEGORY_DESCRIPTIONS: Record<string, string> = {
    sport: "Amakuru ya sport n'ibivugwa mu mikino.",
    "inkuru-yanjye": "Inkuru n'ubuhamya bwihariye bw'abasomyi.",
    ibaruwa: "Amabaruwa, ibitekerezo n'ubutumwa bwubaka.",
    "tumenye-bibiliya": "Inkuru, inyigisho n'ibisobanuro bifasha gusobanukirwa Bibiliya neza.",
};

const DEFAULT_ARTICLE_CATEGORIES: CategoryInsert[] = DEFAULT_ARTICLE_CATEGORY_SEEDS.map((category) => ({
    ...category,
    parent_id: null,
    icon: null,
    description: DEFAULT_CATEGORY_DESCRIPTIONS[category.slug] ?? null,
    hero_image: null,
    show_in_nav: true,
}));

export function getDefaultArticleCategoryOptions(): ArticleCategoryOption[] {
    return DEFAULT_ARTICLE_CATEGORIES.map((category) => ({
        slug: category.slug,
        name: category.name,
        color: category.color,
        nav_group: category.nav_group,
        sort_order: category.sort_order,
    }));
}

export function getDefaultCategoryBySlug(slug: string): CategoryRow | null {
    const category = DEFAULT_ARTICLE_CATEGORIES.find((item) => item.slug === slug);
    if (!category) return null;

    return {
        ...category,
        id: 0,
        created_at: new Date().toISOString(),
    };
}

export async function ensureDefaultArticleCategories(
    client: SupabaseClient<Database>
) {
    await client
        .from("categories")
        .upsert(DEFAULT_ARTICLE_CATEGORIES, { onConflict: "slug" });
}

export async function getArticleCategoryOptions(
    client: SupabaseClient<Database>
): Promise<ArticleCategoryOption[]> {
    await ensureDefaultArticleCategories(client);

    const { data } = await client
        .from("categories")
        .select("slug, name, color, nav_group, sort_order")
        .order("nav_group", { ascending: true, nullsFirst: false })
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true });

    const rows = (data ?? []) as ArticleCategoryOption[];
    const merged = new Map<string, ArticleCategoryOption>();

    for (const category of getDefaultArticleCategoryOptions()) {
        merged.set(category.slug, category);
    }
    for (const category of rows) {
        merged.set(category.slug, category);
    }

    return Array.from(merged.values()).sort((a, b) => {
        const groupCompare = (a.nav_group ?? "zz").localeCompare(b.nav_group ?? "zz");
        if (groupCompare !== 0) return groupCompare;
        if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
        return a.name.localeCompare(b.name);
    });
}
