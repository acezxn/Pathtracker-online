import BackgroundImg from "./background_img";
import Path from "./path";

class FieldObjects {
    static background = new BackgroundImg();
    static path = new Path();
    static objects = [FieldObjects.background, FieldObjects.path];
}

export default FieldObjects;