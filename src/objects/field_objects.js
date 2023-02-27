import BackgroundImg from "./drawable_objects/background_img";
import Grid from "./drawable_objects/grid";
import Path from "./drawable_objects/path";

class FieldObjects {
    static background = new BackgroundImg();
    static grid = new Grid();
    static path = new Path();
    static objects = [FieldObjects.background, FieldObjects.grid, FieldObjects.path];

    static reset() {
        FieldObjects.background = new BackgroundImg();
        FieldObjects.grid = new Grid();
        FieldObjects.path = new Path();
        FieldObjects.objects = [FieldObjects.background, FieldObjects.grid, FieldObjects.path];
    }
}

export default FieldObjects;