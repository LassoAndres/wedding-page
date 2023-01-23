import Layout from '../components/layout'
import {getGuestFromSession, isGuestInSession} from "../server/common/Session";
import ConfirmationForm from "../components/ConfirmationForm";
import DependencyManager from '../server/dependency_injection/DependencyManager'

// This gets called on every request
export async function getServerSideProps({ req, res }) {
    if (isGuestInSession(req)) {
        let guestFromSession = getGuestFromSession(req);
        const guestService = DependencyManager.GuestService();
        let guest = await guestService.validateGuestToken(guestFromSession.token);

        return {
            props: {
                guest
            }
        }
    }
    return {
        redirect: {
            permanent: false,
            destination: `/auth?callback=${encodeURIComponent(req.path)}`
        },
        props: {},
    }
}

export default function Confirmation({guest}) {
    let plusOneCaption = guest.has_plus_one ?
        " Además, te pedimos que completes los datos de tu acompañante si es que venís con uno." : "";

    return (<section className="page-section bg-confirmation text-white" id="contact">
        <div className="container px-4 px-lg-5">
            <div className="row gx-4 gx-lg-5 justify-content-center">
                <div className="col-lg-8 col-xl-6 text-center">
                    <h2 className="mt-0">¿Nos acompañas o te lo perdés?</h2>
                    <hr className="divider"/>
                    <p className="mb-5">
                        Para confirmar tu asistencia al casamiento solo tenes que revisar los datos de contacto y
                        contarnos qué menú preferís.
                        { plusOneCaption }
                    </p>
                </div>
            </div>
            <div className="row gx-4 gx-lg-5 justify-content-center mb-5">
                <div className="col-lg-6">
                    {/** This form is pre-integrated with SB Forms. */}
                    {/** To make this form functional, sign up at */}
                    {/** https://startbootstrap.com/solution/contact-forms */}
                    {/** to get an API token! */}
                    <ConfirmationForm guest={guest}></ConfirmationForm>
                </div>
            </div>
        </div>
    </section>)
}

Confirmation.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}