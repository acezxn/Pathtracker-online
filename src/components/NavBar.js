import { Link } from "react-router-dom"
export default function NavBar() {
    return <>
        <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/help">help</Link></li>
        </ul>
        <div style={{ paddingBottom: "0.5vw"}}>
        </div>
    </>
}