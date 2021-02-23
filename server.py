from flask import Flask,render_template
import gray_lib.trainer as glib

app = Flask(__name__)
#t = glib.Trainer()

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == "__main__":
    app.run(debug=True)