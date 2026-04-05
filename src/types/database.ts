// Auto-generated types for Supabase schema
// Re-run `npx supabase gen types typescript` after schema changes

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
    public: {
        Tables: {
            categories: {
                Row:    CategoryRow;
                Insert: CategoryInsert;
                Update: Partial<CategoryInsert>;
            };
            articles: {
                Row:    ArticleRow;
                Insert: ArticleInsert;
                Update: Partial<ArticleInsert>;
            };
            events: {
                Row:    EventRow;
                Insert: EventInsert;
                Update: Partial<EventInsert>;
            };
            testimonies: {
                Row:    TestimonyRow;
                Insert: TestimonyInsert;
                Update: Partial<TestimonyInsert>;
            };
        };
        Views:     Record<string, never>;
        Functions: Record<string, never>;
        Enums:     Record<string, never>;
    };
}

// ── Categories ─────────────────────────────────────────────
export interface CategoryRow {
    id:         number;
    name:       string;
    slug:       string;
    color:      string;
    created_at: string;
}
export type CategoryInsert = Omit<CategoryRow, "id" | "created_at">;

// ── Articles ───────────────────────────────────────────────
export interface ArticleRow {
    id:           number;
    title:        string;
    slug:         string;
    excerpt:      string;
    content:      string;         // MDX / rich text
    image_url:    string | null;
    category:     string;         // matches categories.slug
    category_color: string;
    author:       string;
    author_avatar: string | null;
    read_time:    string;
    is_published: boolean;
    is_featured:  boolean;
    published_at: string | null;
    created_at:   string;
    updated_at:   string;
}
export type ArticleInsert = Omit<ArticleRow, "id" | "created_at" | "updated_at">;

// ── Events ─────────────────────────────────────────────────
export interface EventRow {
    id:           number;
    title:        string;
    slug:         string;
    description:  string;
    content:      string | null;
    image_url:    string | null;
    event_date:   string;         // ISO date string
    location:     string;
    price:        string | null;
    is_free:      boolean;
    tag:          string;
    is_published: boolean;
    created_at:   string;
    updated_at:   string;
}
export type EventInsert = Omit<EventRow, "id" | "created_at" | "updated_at">;

// ── Testimonies ────────────────────────────────────────────
export interface TestimonyRow {
    id:             number;
    title:          string;
    slug:           string;
    excerpt:        string;
    content:        string;
    person_name:    string;
    person_church:  string | null;
    person_avatar:  string | null;
    image_url:      string | null;
    is_published:   boolean;
    is_featured:    boolean;
    published_at:   string | null;
    created_at:     string;
    updated_at:     string;
}
export type TestimonyInsert = Omit<TestimonyRow, "id" | "created_at" | "updated_at">;
