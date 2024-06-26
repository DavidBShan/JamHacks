import React from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/router";
import styles from '../styles/landing.module.css';



function Index() {
    const { user, error, isLoading } = useUser();
    const router = useRouter();

    if (isLoading) return <div>Loading ...</div>;
    if (error) return <div>{error.message}</div>;

    if (user) {
        router.push("/journal"); // Redirect to /journal if user is logged in
        return null; // Render nothing if redirecting
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>MemorEase</h1>
            <p className={styles.description}>Your personal memory assistant.</p>
            <a href="/api/auth/login" className={styles.loginButton}>Login</a>
        </div>

    );
}

export default Index;

