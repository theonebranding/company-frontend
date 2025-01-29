// import { useLocation } from "react-router-dom";
// import Header from "../components/Header/Header";
// import Footer from "../components/Footer/Footer";
import AppRouter from "../routes/Router";

const Layout = () => {
    // const location = useLocation();

   
    // const hideHeaderFooterRoutes = ["/doctors/appointments", "/doctors/reviews", "/doctors/profile", "/doctors/notifications", "/doctors/profile/me", "/doctors/revenue", "/doctors/dashboard", "/doctors/settings", "user/profile/me", "/users/profile/me"];

    // Check if the current path is in the list
    // const hideHeaderFooter = hideHeaderFooterRoutes.includes(location.pathname);

    return (
        <>
            {/* <Header /> */}
            <main>
                <AppRouter />
            </main>
             {/* <Footer /> */}
        </>
    );
};

export default Layout;