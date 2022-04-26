from flask import Flask, render_template, redirect, url_for

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/news')
def news():
    return render_template('news.html')

@app.route('/newbies')
def newbies():
    return render_template('newbies.html')

@app.route('/top')
def top():
    return render_template('top.html')

@app.route('/tributes')
def tributes():
    return render_template('tributes.html')

@app.route('/faq')
def faq():
    return render_template('faq.html')

@app.route('/contacts')
def contacts():
    return render_template('contacts.html')

@app.route('/profiles/<id>')
def profile(id):
    return render_template('profile.html', userid=id)

if __name__ == '__main__':
    app.run(debug=True, port=8080)