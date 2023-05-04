import NavBar from "../components/NavBar";
import GitHubButton from 'react-github-btn'
import Announcement from "../components/Announcement";



const About = () => {
    return <>
        <NavBar />
        <div style={{ paddingLeft: "7vw" }}>
            <Announcement content={[
                {
                    description: "VEX robotics tutorial for KCIS can be found here!!!",
                    link: "https://acezxn.gitbook.io/vex-ji-qi-ren-cheng-shi-jiao-xue/"
                }
            ]}></Announcement>

            <br />
            <br />
            <br />
            <br />
            <h2>About this tool</h2>

            <p>
                This is an open source tool deployed on the web to assist robot competition teams to create
                paths using path generation algorithms and robot simulation.
            </p>
            <GitHubButton href="https://github.com/acezxn/Pathtracker-online" data-icon="octicon-star" data-size="large" aria-label="Star acezxn/Pathtracker-online on GitHub">Star</GitHubButton>



            <h3>Path generation</h3>
            <p>
                This tool integrated catmull-rom spline curves and cubic Bezier curves for smooth path drawing.

                <br />
                <br />
                Information about catmull-rom spline:
                <br />
                <a href="https://www.cs.cmu.edu/~fp/courses/graphics/asst5/catmullRom.pdf">
                    https://www.cs.cmu.edu/~fp/courses/graphics/asst5/catmullRom.pdf
                </a>
                <br />
                <a href="https://www.youtube.com/watch?v=9_aJGUTePYo">
                    https://www.youtube.com/watch?v=9_aJGUTePYo
                </a>
                <br />
                <br />
                Information about cubic Bezier curve:
                <br />
                <a href="https://javascript.info/bezier-curve">
                    https://javascript.info/bezier-curve
                </a>
                <br />
                <a href="https://www.geeksforgeeks.org/cubic-bezier-curve-implementation-in-c/">
                    https://www.geeksforgeeks.org/cubic-bezier-curve-implementation-in-c/
                </a>
                <br />
            </p>
            <h3>Path following</h3>
            <p>
                This tool uses a modified version of the original algorithm to find the
                lookahead point due to these assumptions:
                <br />
            </p>
            <ol>
                <li>
                    A path consists of many points
                </li>
                <li>
                    The path may overlap with each other
                </li>
            </ol>
            <p>
                For information about the original algorithm, see the resource below about basic pure pursuit.
                <br />
                <br />
                <br />
                To follow a lookahead point, this tool uses two variations of pure pursuit to follow paths: curvature
                based and PID based.
                <br />
                <br />
                For curvature based pure pursuit (basic pure pursuit), the curvature
                to pursuit a lookahead point is calculated, then the left and right velocities
                are determined based on that curvature.

                <br />
                <br />
                For PID based pure pursuit, position and rotation errors are measured and feeded
                to a PID controller to control left and right velocities.
                <br />
                <br />
                Information about basic pure pursuit:
                <br />
                <a href="https://www.ri.cmu.edu/pub_files/pub3/coulter_r_craig_1992_1/coulter_r_craig_1992_1.pdf">
                    https://www.ri.cmu.edu/pub_files/pub3/coulter_r_craig_1992_1/coulter_r_craig_1992_1.pdf
                </a>
                <br />
                <a href="https://wiki.purduesigbots.com/software/control-algorithms/basic-pure-pursuit">
                    https://wiki.purduesigbots.com/software/control-algorithms/basic-pure-pursuit
                </a>
                <br />
            </p>
        </div>
    </>
}

export default About;