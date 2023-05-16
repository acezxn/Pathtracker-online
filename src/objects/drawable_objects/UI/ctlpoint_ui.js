import { insert_ctlpoint, remove_ctlpoint } from "../../event_handler";
import Button from "./button";
import InStageUI from "./instage_ui";
import add_next from "../../../icons/UI_icons/add_next.png";
import add_previous from "../../../icons/UI_icons/add_previous.png";
import remove_point from "../../../icons/UI_icons/remove_point.png";
import FieldObjects from "../../field_objects";

class CtlpointUI extends InStageUI {
    constructor({ x = 20, y = 20} = {}) {
        super({ x: x, y: y });

        this.ctlpoint_idx = 0;

        // styling
        this.padding_horizontal = 10;
        this.padding_vertical = 10;
        this.background_color = "rgba(229, 229, 229, 0.7)";
        this.button_color = "#a1a1a1";
        this.border_radius = 5;

        // buttons to insert point to the next position or previous position
        this.insert_front_button = new Button({
            color: this.button_color,
            description: "Add a control point to the next position",
            icon_src: add_next,
            onclick: () => {
                insert_ctlpoint(this.ctlpoint_idx, 1);
            }
        });
        this.insert_back_button = new Button({
            color: this.button_color,
            description: "Add a control point to the previous position",
            icon_src: add_previous,
            onclick: () => {
                insert_ctlpoint(Math.max(this.ctlpoint_idx, 0), 0);
            }
        });
        this.remove_point_button = new Button({
            color: this.button_color,
            description: "Remove this control point",
            icon_src: remove_point,
            onclick: () => {
                remove_ctlpoint(this.ctlpoint_idx);
            }
        });
        this.buttons = [
            this.insert_front_button, 
            this.insert_back_button,
            this.remove_point_button
        ];

        this.#pack();
    }

    /**
     * Handle mouse click on the UI
     *
     * @param {Number} mouse_x mouse x coordinate
     * @param {Number} mouse_y mouse y coordinate
     * 
     * @returns {boolean} whether the mouse is clicked on the UI
     * @memberof CtlpointUI
     */
    handle_mouseclick(mouse_x, mouse_y) {

        // execute button onclicks
        let button_clicked = false;
        if (this.show) {
            for (let i = 0; i < this.buttons.length; i++) {
                button_clicked = button_clicked || this.buttons[i].handle_mouseclick(mouse_x, mouse_y);
            }
        }
        if (button_clicked) {
            this.show = false;
            FieldObjects.description.set_visibility(false);
        }
        return this.hovering(mouse_x, mouse_y);
    }

    handle_hover_description(mouse_x, mouse_y) {
        if (this.show) {
            for (let i = 0; i < this.buttons.length; i++) {
                if (this.buttons[i].hovering(mouse_x, mouse_y)) {
                    console.log(this.buttons[i].get_description())
                    return this.buttons[i].get_description();
                }
            }
        }  
        return "";
    }

    set_ctlpoint_idx(ctlpoint_idx) {
        this.ctlpoint_idx = ctlpoint_idx;
    }

    set_position(x, y) {
        this.position = { x: x, y: y };
        this.#pack();
    }

    /**
     * Format the UI
     *
     * @memberof CtlpointUI
     */
    #pack() {
        // calculate window width, height, and button positions
        let width = 0, height = 0;
        for (let i = 0; i < this.buttons.length; i++) {
            width += this.buttons[i].size.width;
            height = Math.max(height, this.buttons[i].size.height);
            this.buttons[i].position =
            {
                x: this.position.x + i * (this.buttons[i].size.width + this.padding_horizontal) + this.padding_horizontal,
                y: this.position.y + this.padding_vertical
            };
        }
        width += (this.buttons.length + 1) * this.padding_horizontal;
        height += 2 * this.padding_vertical;

        this.size.width = width;
        this.size.height = height;

    }

    render(ctx, settings) {
        if (this.show) {
            // render UI background
            ctx.beginPath();
            ctx.roundRect(this.position.x, this.position.y, this.size.width, this.size.height, [this.border_radius]);
            ctx.fillStyle = this.background_color;
            ctx.fill();

            // render buttons
            for (let i = 0; i < this.buttons.length; i++) {
                this.buttons[i].render(ctx);
            }
        }
    }
}

export default CtlpointUI;