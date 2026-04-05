import Link from "next/link";
import styles from "./PageHeader.module.css";

type Crumb = { label: string; href?: string };

export type PageHeaderProps = {
    title:            string;
    description?:     string;
    backgroundImage?: string;        // if omitted, solid navy variant is used
    breadcrumb?:      Crumb[];
};

export default function PageHeader({
    title,
    description,
    backgroundImage,
    breadcrumb = [],
}: PageHeaderProps) {
    const hasBg = Boolean(backgroundImage);

    return (
        <header className={`${styles.header} ${hasBg ? "" : styles.solid}`}>

            {hasBg && (
                <>
                    <div
                        className={styles.bg}
                        style={{ backgroundImage: `url(${backgroundImage})` }}
                        role="img"
                        aria-label={title}
                    />
                    <div className={styles.overlay} aria-hidden />
                </>
            )}

            <div className={`container ${styles.content}`}>

                {breadcrumb.length > 0 && (
                    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
                        <Link href="/" className={styles.crumbLink}>Ahabanza</Link>
                        {breadcrumb.map((crumb, i) => (
                            <span key={i} style={{ display: "contents" }}>
                                <span className={styles.crumbSep} aria-hidden>›</span>
                                {crumb.href ? (
                                    <Link href={crumb.href} className={styles.crumbLink}>{crumb.label}</Link>
                                ) : (
                                    <span className={styles.crumbCurrent} aria-current="page">{crumb.label}</span>
                                )}
                            </span>
                        ))}
                    </nav>
                )}

                <h1 className={styles.title}>{title}</h1>
                {description && <p className={styles.description}>{description}</p>}

            </div>
        </header>
    );
}
