import { useEffect, useRef} from "react";

function set_announce_content(announce_msg, description, link) {
    announce_msg.innerHTML = description;
    let link_element = document.createElement("a");
    link_element.style.fontSize = "max(1vw, 10px)";
    link_element.href = link;
    link_element.innerHTML = "\t" + link;
    announce_msg.appendChild(link_element);
}
export default function Announcement(props) {
    const effectRan = useRef(false);
    useEffect(() => {
        if (effectRan.current === true) {
            return;
        }
        var announcement_index = 0;
        let announce_msg = document.getElementById("announce_msg");

        set_announce_content(announce_msg, props.content[announcement_index].description, props.content[announcement_index].link);

        let end_position = announce_msg.offsetWidth;
        let start_position = announce_msg.parentElement.offsetWidth;
        let flag = 0;

        setInterval(() => {
            announce_msg.style.marginLeft = --flag + "px";
            if (end_position === -flag) {
                
                flag = start_position;
                if (announcement_index === props.content.length - 1) {
                    announcement_index = 0;
                } else {
                    announcement_index++;
                }
                set_announce_content(announce_msg, props.content[announcement_index].description, props.content[announcement_index].link);
            }
        }, 10);
        
        effectRan.current = true;
    }, [props]);

    
    return <>
        <div style={{
            position: "fixed",
            width: "94%",
            height: "3vw",
            top: 0,
            left: "6vw",
            backgroundColor: "rgba(180, 180, 180, 0.3)",
            zIndex: "1",
            overflow: "hidden",
            borderBottom: "solid 1px rgba(0,0,0,0.1)",
        }} id="announcement">
            <p style={{
                fontSize: "max(1vw, 10px)",
                whiteSpace: "nowrap",
                clear: "both",
                float: "left",
            }} id="announce_msg">

            </p>
        </div>
    </>
}