import CtlpointUI from "./drawable_objects/UI/ctlpoint_ui";
import Description from "./drawable_objects/UI/description";
import BackgroundImg from "./drawable_objects/background_img";
import Grid from "./drawable_objects/grid";
import Path from "./drawable_objects/path";

class FieldObjects {
    static background = new BackgroundImg();
    static grid = new Grid();
    static path = new Path();
    static instage_ui = new CtlpointUI();
    static description = new Description();
    static objects = [FieldObjects.background, FieldObjects.grid, FieldObjects.path, FieldObjects.instage_ui, FieldObjects.description];

    static reset() {
        FieldObjects.background = new BackgroundImg();
        FieldObjects.grid = new Grid();
        FieldObjects.path = new Path();
        FieldObjects.instage_ui = new CtlpointUI();
        FieldObjects.description =  new Description();
        FieldObjects.objects = [FieldObjects.background, FieldObjects.grid, FieldObjects.path, FieldObjects.instage_ui, FieldObjects.description];
    }
}

export default FieldObjects;