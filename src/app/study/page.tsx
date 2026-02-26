export default function PlaceholderPage() {
    return (
        <div className="container" style={{ padding: '8rem 0', textAlign: 'center', minHeight: '60vh' }}>
            <h1 className="section-title">Coming Soon</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                This category is currently under construction. Please check back later for spiritual insights and updates.
            </p>
            <div style={{ marginTop: '2rem' }}>
                <a href="/" className="btn btn-primary">Return Home</a>
            </div>
        </div>
    );
}
