import { Link } from "react-router-dom"
import "../css/NavBar.css"

export default function NavBar() {
    return <>
        <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/help">Help</Link></li>
        </ul>
        <div style={{ paddingBottom: "0.2vw"}}>
        </div>
    </>
}