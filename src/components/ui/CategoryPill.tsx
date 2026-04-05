import styles from "./CategoryPill.module.css";

export type CategoryPillProps = {
    label:    string;
    active?:  boolean;
    onClick?: () => void;
};

export default function CategoryPill({ label, active = false, onClick }: CategoryPillProps) {
    return (
        <button
            className={`${styles.pill} ${active ? styles.active : ""}`}
            onClick={onClick}
            aria-pressed={active}
        >
            {label}
        </button>
    );
}
