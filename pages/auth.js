import styles from './styles/auth.module.css'
import TokenForm from "../components/TokenForm";

// This gets called on every request
export async function getServerSideProps({ req, res }) {
    if (req.session.guest) {
        return {
            redirect: {
                permanent: false,
                destination: req.query.callback ? req.query.callback :"/",
            }
        }
    }
    return {
        props: {}
    }
}

export default function Auth() {
    function handleSuccessAuth() {
        const queryParams = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        });
        let redirect = "/";
        if (queryParams.callback) {
            redirect = queryParams.callback
        }
        window.location.replace(redirect)
    }

    return (<div className={`container ${styles.container}`}>
        <style suppressHydrationWarning>{`
            body {
                background-image: url("/auth-background.jpg");
                background-position: center;
                background-size: cover;
                height: 100vh;
            }
        `}</style>
        <div className="row gx-4 gx-lg-5 h-100">
            <div className="col-lg-8 col-md-12 align-self-end">
                <h1 className="text-white font-weight-bold">¡Oops!</h1>
            </div>
            <div className="col-lg-6 col-md-8 align-self-baseline">
                <p className="text-white">
                    Parece que no pudimos identificarte. Introduce el código de invitado que te enviamos por email.
                </p>
                <TokenForm onSuccessAuth={handleSuccessAuth}/>
            </div>
        </div>
    </div>)
}