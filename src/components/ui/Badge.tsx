import styles from "./Badge.module.css";

export type BadgeVariant = "red" | "blue" | "gold" | "green" | "purple" | "navy";

export type BadgeProps = {
    label:    string;
    variant?: BadgeVariant;
};

export default function Badge({ label, variant = "red" }: BadgeProps) {
    return (
        <span className={`${styles.badge} ${styles[variant]}`}>
            {label}
        </span>
    );
}
