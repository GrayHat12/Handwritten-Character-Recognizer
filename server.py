from flask import Flask, render_template, request, jsonify, make_response
import gray_lib.trainer as glib
import base64
import cv2
import time


def hi_getCharFromLabel(label):
    alphabets = 'क ख ग घ ङ च छ ज झ ञ ट ठ ड ढ ण त थ द ध न प फ ब भ म य र ल व श ष स ह क्ष त्र ज्ञ'.split(
        ' ')
    return alphabets[label]


en_trainer = glib.Trainer()
hi_trainer = glib.Trainer(
    labelToMeaningfulOutput=hi_getCharFromLabel, shape=32)

app = Flask(__name__)
#t = glib.Trainer()


def predict_hindi(image):
    _image = cv2.resize(image, (32, 32))
    label, char = hi_trainer.predict_one(
        _image, show_image=False, normalize=True, only_best=False)
    cv2.imwrite('./timestamps/{t}-res.png'.format(t=str(time.time())), _image)
    return label, char


def predict_english(image):
    _image = cv2.resize(image, (28, 28))
    label, char = en_trainer.predict_one(
        _image, show_image=False, normalize=True)
    cv2.imwrite('./timestamps/{t}-res.png'.format(t=str(time.time())), _image)
    return label, char


def save_image(data):
    image_name = './timestamps/{t}.png'.format(t=str(time.time()))
    data = data.replace('data:image/png;base64,', '')
    with open(image_name, "wb") as fh:
        fh.write(base64.decodebytes(data.encode()))
    return image_name


def load_image(path):
    img = cv2.imread(path, cv2.IMREAD_GRAYSCALE)
    return img


@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')


@app.route('/api/predict', methods=['POST'])
def predict():
    req = request.get_json()
    lang = req['lang']
    #image = req['tensor']
    _image = req['image']
    char = 'NaN'
    label = 'NaN'
    image_name = save_image(_image)
    image = load_image(image_name)
    if lang == 'en':
        label, char = predict_english(image)
    elif lang == 'hi':
        label, char = predict_hindi(image)
    print('prediction', label, char)
    res = make_response(
        jsonify({"message": "ok", "prediction": {'label': label, 'char': char}}), 200)
    return res


if __name__ == "__main__":
    en_trainer.load_model(path='model/model.h5')
    hi_trainer.load_model(path='model/hi_model.h5')
    app.run(debug=True)
