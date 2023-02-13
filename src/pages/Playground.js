import { Helmet } from "react-helmet"
const Playground = () => {
    return (
        <>
            <Helmet>
                <script type="module" src="js/point.js"></script>
                <script type="module" src="js/catmull_rom.js"></script>
                <script type="module" src="js/playground.js"></script>
            </Helmet>

            <h1>Playground</h1>
            <div className="stageholder">
                <canvas id="Stage" width="500" height="500"></canvas>
            </div>

            {/* <label class="switch">
                <input type="checkbox" />
                <span class="slider"></span>
            </label> */}
        </>
    );
};

export default Playground;
