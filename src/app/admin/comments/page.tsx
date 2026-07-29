import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase";
import type { ArticleCommentRow, ArticleRow } from "@/types/database";
import CommentModerationClient, { type AdminArticleComment } from "./_components/CommentModerationClient";

export const metadata: Metadata = { title: "Comments" };

const MEDIA_GROUP_CATEGORIES = new Set([
    "music-academy",
    "films",
    "records",
    "music-talent",
    "online-radio",
    "bible-quiz",
    "practice-room",
    "podcast",
]);

const INYIGISHO_CATEGORIES = new Set([
    "umuryango",
    "abana",
    "urubyiruko",
    "abashakanye",
    "abasore-n-inkumi",
    "abakozi-b-imana",
]);

function articleHref(article: Pick<ArticleRow, "slug" | "category">) {
    if (article.category === "ibigwi") return `/ibigwi/${article.slug}`;
    if (article.category === "tumenye-bibiliya") return `/tumenye-bibiliya/${article.slug}`;
    if (MEDIA_GROUP_CATEGORIES.has(article.category)) return `/urugero-media-group/${article.slug}`;
    if (INYIGISHO_CATEGORIES.has(article.category)) return `/inyigisho/${article.slug}`;
    return `/amakuru/${article.slug}`;
}

export default async function AdminCommentsPage() {
    const admin = supabaseAdmin();
    const { data: commentData } = await admin
        .from("article_comments")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(300);

    const comments = (commentData ?? []) as ArticleCommentRow[];
    const articleIds = Array.from(new Set(comments.map(comment => comment.article_id)));
    const { data: articleData } = articleIds.length > 0
        ? await admin
            .from("articles")
            .select("id, title, slug, category")
            .in("id", articleIds)
        : { data: [] };

    const articles = new Map(
        ((articleData ?? []) as Pick<ArticleRow, "id" | "title" | "slug" | "category">[])
            .map(article => [article.id, article]),
    );

    const hydratedComments: AdminArticleComment[] = comments.map(comment => {
        const article = articles.get(comment.article_id);
        return {
            ...comment,
            article: article
                ? { title: article.title, href: articleHref(article) }
                : undefined,
        };
    });

    return <CommentModerationClient comments={hydratedComments} />;
}
