from flask import Flask,render_template,request,jsonify,make_response
import gray_lib.trainer as glib

en_trainer = glib.Trainer()

app = Flask(__name__)
#t = glib.Trainer()


def predict_english(image):
    label,char = en_trainer.predict_one(image)
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
    print('prediction',label,char)
    res = make_response(jsonify({"message":"ok","prediction":{'label':label,'char':char}}),200)
    return res

if __name__ == "__main__":
    en_trainer.load_model()
    app.run(debug=True)