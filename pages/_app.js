import Auth0ProviderWithHistory from './auth0-config';
import '../styles/globals.css';



export default function MyApp({ Component, pageProps }) {
    return (
        <Auth0ProviderWithHistory>
            <Component {...pageProps} />
        </Auth0ProviderWithHistory>
    );
}


