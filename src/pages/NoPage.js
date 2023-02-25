import { Link } from "react-router-dom";

const NoPage = () => {
    return (
        <>
            <h1 className="big">404</h1>
            <h3 style={{textAlign:"center"}}>page not found</h3>
            <Link className="link" to="/">Go to home</Link>
        </>
    );
};

export default NoPage;
