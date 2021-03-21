from flask import Flask,render_template,request,jsonify,make_response
import gray_lib.trainer as glib

def hi_getCharFromLabel(label):
    alphabets = 'क ख ग घ ङ च छ ज झ ञ ट ठ ड ढ ण त थ द ध न प फ ब भ म य र ल व श ष स ह क्ष त्र ज्ञ'.split(' ')
    return alphabets[label]

en_trainer = glib.Trainer()
hi_trainer = glib.Trainer(labelToMeaningfulOutput=hi_getCharFromLabel,shape=32)

app = Flask(__name__)
#t = glib.Trainer()

def predict_hindi(image):
    label,char = hi_trainer.predict_one(image,show_image=True,normalize=True)
    return label,int(char)

def predict_english(image):
    label,char = en_trainer.predict_one(image,show_image=True,normalize=True)
    return label,int(char)

@app.route('/',methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/api/predict',methods=['POST'])
def predict():
    req = request.get_json()
    lang = req['lang']
    image = req['tensor']
    char = 'NaN'
    label = 'NaN'
    if lang == 'en':
        label,char = predict_english(image)
    elif lang == 'hi':
        label,char = predict_hindi(image)
    print('prediction',label,char)
    res = make_response(jsonify({"message":"ok","prediction":{'label':label,'char':char}}),200)
    return res

if __name__ == "__main__":
    en_trainer.load_model()
    hi_trainer.load_model(path='model/hi_model.h5')
    app.run(debug=True)