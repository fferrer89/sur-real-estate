import { ObjectId } from "mongodb";
import {images} from "../config/mongoCollections.js";


const imageData = {
    async createImage(
        filename,
        data // Binary()
    ) {
        let newImage = {
            filename,
            data,
        };

        const imageCollection = await images();
        const imageInfo = await imageCollection.insertOne(newImage);
        if (!imageInfo.acknowledged || !imageInfo.insertedId) {
            throw new Error('Could not add listing');
        }
        const imageId = imageInfo.insertedId;

        return imageId.toString();
    },

    async getImage(imageId) {
        const imageCollection = await images();
        const image = await imageCollection.findOne({
            _id: new ObjectId(imageId),
        });
        if (image === null) throw new Error('Image could not be found with provided id');
        return image;
    },

};

export default imageData;