class Predictor {
    constructor() {
        this.model = null;
    };
    setModel = (model) => {
        this.model = model;
    }
    predict = (image) => {
        let label = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
        let labelTensor = tf.tensor(label, [1, 26]);
        let labelMax = labelTensor.max();
        let labelMin = labelTensor.min();
        console.log(image.length, image[0].length);
        let tensor = tf.tensor([image], [1, 28, 28])
        let imageMax = tensor.max();
        let imageMin = tensor.min();

        let normalizedImages = tensor.sub(imageMin).div(imageMax.sub(imageMin));
        let preds = this.model.predict(normalizedImages);
        let unNorm = preds.mul(labelMax.sub(labelMin)).add(labelMin);
        console.log(preds,unNorm);
        this.prediction = unNorm;
        return unNorm;
    };
};