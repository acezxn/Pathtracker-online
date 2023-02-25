import { Link } from "react-router-dom";

const Home = () => {
    return (
        <>
            <h1>Pathtracker Online</h1>
            <p style={{textAlign: "center"}}>A tool meant for robot path planning and path following simulation</p>
            <Link to="/playground" className="link">Try now</Link>
        </>
    );
};

export default Home;
