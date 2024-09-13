import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";

const Home = () => {
    return (
        <>
            <NavBar></NavBar>

            <div style={{ width: "100%", position: "absolute", top: "calc(50vh - 200px)" }}>
                <div style={{width: "100vw"}}>
                <h1>Pathtracker Online</h1>
                <p style={{ textAlign: "center" }}>A tool meant for robot path planning and path following simulation</p>
                <br />
                <Link to="/path-follow-simulator" className="link" style={{ fontSize: "max(3vw, 20px)" }}>Try now</Link>
                <br />
                </div>
            </div>
        </>
    );
};

export default Home;
