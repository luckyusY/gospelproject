// Auto-generated types for Supabase schema
// Re-run `npx supabase gen types typescript` after schema changes

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
    public: {
        Tables: {
            categories: {
                Row:    CategoryRow & Record<string, unknown>;
                Insert: CategoryInsert & Record<string, unknown>;
                Update: Partial<CategoryInsert> & Record<string, unknown>;
                Relationships: [];
            };
            articles: {
                Row:    ArticleRow & Record<string, unknown>;
                Insert: ArticleInsert & Record<string, unknown>;
                Update: Partial<ArticleInsert> & Record<string, unknown>;
                Relationships: [];
            };
            events: {
                Row:    EventRow & Record<string, unknown>;
                Insert: EventInsert & Record<string, unknown>;
                Update: Partial<EventInsert> & Record<string, unknown>;
                Relationships: [];
            };
            testimonies: {
                Row:    TestimonyRow & Record<string, unknown>;
                Insert: TestimonyInsert & Record<string, unknown>;
                Update: Partial<TestimonyInsert> & Record<string, unknown>;
                Relationships: [];
            };
            site_settings: {
                Row:    SiteSettingRow & Record<string, unknown>;
                Insert: SiteSettingInsert;
                Update: Partial<SiteSettingInsert> & Record<string, unknown>;
                Relationships: [];
            };
            radio_comments: {
                Row:    RadioCommentRow & Record<string, unknown>;
                Insert: RadioCommentInsert & Record<string, unknown>;
                Update: Partial<RadioCommentInsert> & Record<string, unknown>;
                Relationships: [];
            };
            radio_tracks: {
                Row:    RadioTrackRow & Record<string, unknown>;
                Insert: RadioTrackInsert & Record<string, unknown>;
                Update: Partial<RadioTrackInsert> & Record<string, unknown>;
                Relationships: [];
            };
            pages: {
                Row:    PageRow & Record<string, unknown>;
                Insert: PageInsert & Record<string, unknown>;
                Update: Partial<PageInsert> & Record<string, unknown>;
                Relationships: [];
            };
            videos: {
                Row:    VideoRow & Record<string, unknown>;
                Insert: VideoInsert & Record<string, unknown>;
                Update: Partial<VideoInsert> & Record<string, unknown>;
                Relationships: [];
            };
            nav_items: {
                Row:    NavItemRow & Record<string, unknown>;
                Insert: NavItemInsert & Record<string, unknown>;
                Update: Partial<NavItemInsert> & Record<string, unknown>;
                Relationships: [];
            };
            homepage_sections: {
                Row:    HomepageSectionRow & Record<string, unknown>;
                Insert: HomepageSectionInsert & Record<string, unknown>;
                Update: Partial<HomepageSectionInsert> & Record<string, unknown>;
                Relationships: [];
            };
        };
        Views:     Record<string, never>;
        Functions: Record<string, never>;
        Enums:     Record<string, never>;
    };
}

// ── Categories ─────────────────────────────────────────────
export interface CategoryRow {
    id:          number;
    name:        string;
    slug:        string;
    color:       string;
    parent_id:   number | null;
    nav_group:   string | null;   // 'amakuru' | 'inyigisho' | null (top-level)
    icon:        string | null;
    description: string | null;
    hero_image:  string | null;
    sort_order:  number;
    show_in_nav: boolean;
    created_at:  string;
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

// â”€â”€ Site Settings â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export interface SiteSettingRow {
    key:         string;
    value:       string;
    label:       string;
    description: string | null;
    updated_at:  string;
}
export type SiteSettingInsert = Record<string, unknown> & {
    key:         string;
    value:       string;
    label?:       string;
    description?: string | null;
};

// Radio Comments
export interface RadioCommentRow {
    id:            number;
    listener_name: string;
    message:       string;
    is_approved:   boolean;
    created_at:    string;
}
export type RadioCommentInsert = Omit<RadioCommentRow, "id" | "created_at">;

// Radio Fallback Tracks
export interface RadioTrackRow {
    id:           number;
    title:        string;
    file_url:     string;
    storage_path: string | null;
    is_active:    boolean;
    sort_order:   number;
    created_at:   string;
}
export type RadioTrackInsert = Omit<RadioTrackRow, "id" | "created_at">;

// ── Pages (rich editable content pages) ────────────────────
export interface PageRow {
    id:           number;
    slug:         string;
    title:        string;
    subtitle:     string;
    hero_image:   string | null;
    icon:         string | null;
    color:        string;
    content:      string;          // rich HTML
    nav_group:    string | null;   // e.g. 'media-group'
    is_published: boolean;
    sort_order:   number;
    created_at:   string;
    updated_at:   string;
}
export type PageInsert = Omit<PageRow, "id" | "created_at" | "updated_at">;

// ── Videos (YouTube embeds, per section) ───────────────────
export interface VideoRow {
    id:           number;
    title:        string;
    description:  string;
    youtube_id:   string;
    section:      string;          // 'homepage' | 'tv-radio'
    sort_order:   number;
    is_published: boolean;
    created_at:   string;
}
export type VideoInsert = Omit<VideoRow, "id" | "created_at">;

// ── Navigation menu items ──────────────────────────────────
export interface NavItemRow {
    id:         number;
    label:      string;
    href:       string;
    parent_id:  number | null;
    sort_order: number;
    is_mega:    boolean;
    is_visible: boolean;
    created_at: string;
}
export type NavItemInsert = Omit<NavItemRow, "id" | "created_at">;

// ── Homepage sections (toggle + order) ─────────────────────
export interface HomepageSectionRow {
    id:         number;
    key:        string;
    label:      string;
    is_enabled: boolean;
    sort_order: number;
}
export type HomepageSectionInsert = Omit<HomepageSectionRow, "id">;
