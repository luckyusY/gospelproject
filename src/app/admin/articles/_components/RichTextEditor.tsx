"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import styles from "../../form.module.css";

const TinyMceEditor = dynamic(
    () => import("@tinymce/tinymce-react").then((mod) => mod.Editor),
    {
        ssr: false,
        loading: () => <div className={styles.editorLoading}>Editor irimo gufunguka...</div>,
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
                Andika nk&apos;uko ubibona: imitwe, links, amafoto, bullet lists na quotes bizabikwa nk&apos;inyandiko ya HTML isukuye.
            </span>
            {editorTimedOut && (
                <div className={styles.editorWarning} role="status">
                    TinyMCE itinze gufunguka cyangwa iyi domain ntiyemewe kuri Tiny Cloud. Ushobora gukoresha fallback iri hasi.
                </div>
            )}
            <details className={styles.htmlFallback} open={editorTimedOut || undefined}>
                <summary>HTML fallback niba TinyMCE yanze gukora kuri iyi domain</summary>
                <textarea
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    rows={10}
                    className={styles.textarea}
                    spellCheck={false}
                    placeholder="<h2>Umutwe</h2><p>Andika inyandiko hano...</p>"
                />
            </details>
        </div>
    );
}
