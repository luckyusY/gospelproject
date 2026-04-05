export default function PlaceholderPage() {
    return (
        <div className="container" style={{ padding: '8rem 0', textAlign: 'center', minHeight: '60vh' }}>
            <h1 className="section-title">Christian Life</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                This category is currently under construction. Please check back later for lifestyle content.
            </p>
            <div style={{ marginTop: '2rem' }}>
                <a href="/" className="btn btn-primary">Return Home</a> {/* eslint-disable-line @next/next/no-html-link-for-pages */}
            </div>
        </div>
    );
}
