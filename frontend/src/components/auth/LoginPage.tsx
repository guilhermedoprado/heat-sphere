import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../lib/auth';
import styles from './LoginPage.module.css';

export default function LoginPage() {
    const { isAuthenticated, loginWithGoogle } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated) navigate('/my-notes', { replace: true });
    }, [isAuthenticated, navigate]);

    async function handleGoogleSuccess(credential: string) {
        setError('');
        setLoading(true);
        try {
            await loginWithGoogle(credential);
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            setError(`Authentication failed: ${msg}`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <h1 className={styles.logo}>HeatSphere</h1>
                <p className={styles.subtitle}>Personal notes workspace</p>

                <div className={styles.divider} />

                <p className={styles.hint}>Sign in to access your notes</p>

                {loading ? (
                    <p className={styles.loading}>Signing in…</p>
                ) : (
                    <div className={styles.googleBtn}>
                        <GoogleLogin
                            onSuccess={(response) => {
                                if (response.credential) {
                                    handleGoogleSuccess(response.credential);
                                }
                            }}
                            onError={() => setError('Google sign-in failed. Please try again.')}
                            shape="rectangular"
                            theme="outline"
                            size="large"
                            text="signin_with"
                        />
                    </div>
                )}

                {error && <p className={styles.error}>{error}</p>}
            </div>
        </div>
    );
}
