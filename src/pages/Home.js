import { Link } from "react-router-dom";

const Home = () => {
    return (
        <>
            <h1>Pathtracker Online</h1>
            <p style={{textAlign: "center"}}>A tool meant for robot path planning and path following simulation</p>
            <br />
            <Link to="/playground" className="link" style={{fontSize: "max(3vw, 20px)"}}>Try now</Link>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <img alt="" src={require("../images/path.png")} style={{display: "block", width:"50vw", height:"auto", marginLeft: "auto", marginRight: "auto"}}></img>
            <h3 style={{textAlign: "center"}}>Draw smooth paths</h3>
            <p style={{textAlign: "center"}}>Utilize path generation algorithm to create smooth paths.</p>
            <br />
            <br />
            <br />
            <img alt="" src={require("../images/simulation.png")} style={{display: "block", width:"30vw", height:"auto", marginLeft: "auto", marginRight: "auto"}}></img>
            <h3 style={{textAlign: "center"}}>Simulate on the fly</h3>
            <p style={{textAlign: "center"}}>Simulate robot movements directly on the application.</p>
            <br />
            <br />
            <br />
            <img alt="" src={require("../images/settings.png")} style={{display: "block", width:"50vw", height:"auto", marginLeft: "auto", marginRight: "auto"}}></img>
            <h3 style={{textAlign: "center"}}>Customizable settings and exports</h3>
            <p style={{textAlign: "center"}}>The application is highly customizable, allow it to fit in various use cases.</p>
            <br />
            <br />
            <br />
            <img alt="" src={require("../images/session_upload.png")} style={{display: "block", width:"50vw", height:"auto", marginLeft: "auto", marginRight: "auto"}}></img>
            <h3 style={{textAlign: "center"}}>Savable sessions</h3>
            <p style={{textAlign: "center"}}>A developer friendly functionality to allow sharing of successful simulations.</p>
        </>
    );
};

export default Home;
