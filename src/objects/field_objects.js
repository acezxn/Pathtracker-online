import BackgroundImg from "./drawable_objects/background_img";
import Path from "./drawable_objects/path";

class FieldObjects {
    static background = new BackgroundImg();
    static path = new Path();
    static objects = [FieldObjects.background, FieldObjects.path];
    
    static reset() {
        FieldObjects.background = new BackgroundImg();
        FieldObjects.path = new Path();
        FieldObjects.objects = [FieldObjects.background, FieldObjects.path];
    }
}

export default FieldObjects;