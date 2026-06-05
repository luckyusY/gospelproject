"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import styles from "../../form.module.css";
import { uploadToCloudinary } from "@/lib/cloudinaryUpload";

const TinyMceEditor = dynamic(
    () => import("@tinymce/tinymce-react").then((mod) => mod.Editor),
    {
        ssr: false,
        loading: () => <div className={styles.editorLoading}>Editor is loading...</div>,
    },
);

const tinymceApiKey = process.env.NEXT_PUBLIC_TINYMCE_API_KEY
    ?? "wp1cro1p0yeuzcvdwyejs4pfm061yj4mzoflk6yak9z6obef";

type Props = {
    value: string;
    onChange: (value: string) => void;
};

export default function RichTextEditor({ value, onChange }: Props) {
    const [editorReady, setEditorReady] = useState(false);
    const [editorTimedOut, setEditorTimedOut] = useState(false);

    useEffect(() => {
        const timeout = window.setTimeout(() => {
            if (!editorReady) setEditorTimedOut(true);
        }, 7000);

        return () => window.clearTimeout(timeout);
    }, [editorReady]);

    return (
        <div className={styles.editorShell}>
            <TinyMceEditor
                apiKey={tinymceApiKey}
                value={value}
                onEditorChange={onChange}
                onInit={() => setEditorReady(true)}
                init={{
                    height: 560,
                    menubar: "edit insert view format table tools help",
                    plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "code",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                        "help",
                        "wordcount",
                    ],
                    toolbar:
                        "undo redo | blocks | bold italic underline blockquote | " +
                        "alignleft aligncenter alignright alignjustify | bullist numlist | " +
                        "link image media table | removeformat | preview code fullscreen",
                    block_formats: "Paragraph=p; Heading 2=h2; Heading 3=h3; Heading 4=h4",
                    branding: false,
                    promotion: false,
                    image_caption: true,
                    image_advtab: true,
                    image_title: true,
                    // ── Inline image uploads → Cloudinary ────────────
                    automatic_uploads: true,
                    paste_data_images: true,           // pasted screenshots upload too
                    file_picker_types: "image",
                    images_file_types: "jpeg,jpg,png,webp,gif",
                    images_upload_handler: (
                        blobInfo: { blob: () => Blob },
                        progress: (percent: number) => void,
                    ) => uploadToCloudinary(blobInfo.blob(), progress),
                    link_assume_external_targets: "https",
                    link_default_target: "_blank",
                    content_style:
                        "body{font-family:Georgia,'Times New Roman',serif;font-size:17px;line-height:1.75;color:#161616;}" +
                        "h2,h3,h4{font-family:Arial,sans-serif;line-height:1.2;color:#161616;}" +
                        "blockquote{border-left:4px solid #d00000;margin-left:0;padding-left:16px;color:#333;}" +
                        "img{max-width:100%;height:auto;border-radius:12px;}" +
                        "a{color:#b80000;}",
                }}
            />
            <input type="hidden" name="content" value={value} />
            <span className={styles.hint}>
                Write as you see it: headings, links, bullet lists and quotes. Add as many
                images as you like — click the image button, drag &amp; drop, or paste them.
                They&apos;re uploaded to Cloudinary and embedded in the story. Paste a Twitter/X
                post link on its own line to embed it in the published article.
            </span>
            {editorTimedOut && (
                <div className={styles.editorWarning} role="status">
                    The editor took too long to load, or this domain isn&apos;t allowed on Tiny Cloud. You can use the HTML fallback below.
                </div>
            )}
            <details className={styles.htmlFallback} open={editorTimedOut || undefined}>
                <summary>HTML fallback (if the editor won&apos;t load on this domain)</summary>
                <textarea
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    rows={10}
                    className={styles.textarea}
                    spellCheck={false}
                    placeholder="<h2>Heading</h2><p>Write your article here...</p>"
                />
            </details>
        </div>
    );
}
