import numpy as np
import tensorflow as tf
import random
import matplotlib.pyplot as plt
import sys
import tensorflowjs as tfjs
import time


def showImage(image,save=False):
    plt.imshow(image, cmap='gray')
    #if save:
    plt.savefig('./timestamps/{time}.png'.format(time=str(time.time())))
    plt.close()
    #else:
    #    plt.show()


def getCharAndLabel(image, label):
    alphabets = 'a b c d e f g h i j k l m n o p q r s t u v w x y z'.split(
        ' ')
    #image = np.transpose(image)
    return image, label, alphabets[label]


def getCharFromLabel(label):
    alphabets = 'a b c d e f g h i j k l m n o p q r s t u v w x y z'.split(
        ' ')
    return alphabets[label]


def showRandomImageFrom(images, labels, index=None):
    if index == None:
        index = random.randrange(0, len(images))
    image, label, character = getCharAndLabel(images[index], labels[index])
    showImage(image)
    print(label, character)
    return label, character, index


def zeroesAnd255s(image):
    n_image = []
    for im in image:
        if im == 0:
            n_image.append(0)
        else:
            n_image.append(255)
    return n_image

"""
Used to train for any language
"""


class Trainer:

    """
    {x_train} : 1-D List type input images for training with expected {shape}x{shape} length for each element
    {y_train} : 1-D List type input labels for training
    {x_test} : 1-D List type input images for testing with expected {shape}x{shape} length for each element
    {y_test} : 1-D List type input labels for testing 
    {shape} : Integer defining the shape of image (shape x shape)
    {labelToMeaningfulOutput} : Funtion to convert label to character
    {verbose} : 0 means no output, 1 means only tensorflow related output, 2 means all output on console
    """

    def __init__(self,
                 x_train=[],
                 y_train=[],
                 x_test=[],
                 y_test=[],
                 shape=28,
                 labelToMeaningfulOutput=getCharFromLabel,
                 verbose=2,
                 add_to_label=-1
                 ):
        self._x_train = np.array([np.transpose(np.array(image).reshape(shape,shape)) for image in x_train])
        self._y_train = np.array(y_train) + add_to_label
        self._x_test = np.array([np.transpose(np.array(image).reshape(shape,shape)) for image in x_test])
        self._y_test = np.array(y_test) + add_to_label
        self._labelToMeaningfulOutput = labelToMeaningfulOutput
        self._model = None
        self._verbose = verbose
        self._normalized_x_train = self._x_train
        self._normalized_x_test = self._x_test
        self._normalized = False
        self._trained = False
        self._shape = shape
        self._batch_size = 128

    def create_model(self, hidden_activation=tf.nn.relu, output_activation=tf.nn.softmax, batch_size=128):
        self._batch_size = batch_size
        self._model = tf.keras.models.Sequential()
        self._model.add(tf.keras.layers.Flatten(input_shape=(self._shape, self._shape)))
        self._model.add(tf.keras.layers.Dense(
            128, activation=hidden_activation))
        self._model.add(tf.keras.layers.Dense(
            128, activation=hidden_activation))
        self._model.add(tf.keras.layers.Dense(
            self._get_unique_labels(), activation=output_activation))

    def compile_model(self, optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy']):
        if self._model == None:
            self._print("No model exists, Creating a default model")
            self.create_model()
        self._print('compiling model', self._model)
        self._model.compile(optimizer=optimizer, loss=loss, metrics=metrics)
        self._model.build(input_shape=(
            len(self._normalized_x_train), self._shape, self._shape))
        self._print('model compiled successfully')

    def train(self, normalize=True, epochs=3):
        if (not self._normalized) and normalize:
            self._normalize_input()
        self._model.fit(self._normalized_x_train, self._y_train,
                        epochs=epochs, verbose=self._verbose)
        self._trained = True

    def save_model(self, path='model/model.h5', tfjs_format=False):
        if tfjs_format:
            tfjs.converters.save_keras_model(self._model, path)
        else:
            self._model.save(path)

    def model_summary(self):
        self._model.summary()

    def load_model(self, path='/model/model.h5', summary=True):
        self._model = tf.keras.models.load_model(path)
        if summary:
            self.model_summary()

    def get_test_images(self):
        return self._x_test

    def get_test_labels(self):
        return self._y_test

    def get_train_images(self):
        return self._x_train

    def get_train_labels(self):
        return self._y_train

    train_images = property(get_train_images)
    test_images = property(get_test_images)
    train_labels = property(get_train_labels)
    test_labels = property(get_test_labels)

    """
    Returns validation loss, validation accuracy
    """

    def evaluate(self,x_test=[],y_test=[],normalize=True,add_to_label=-1):
        if len(x_test)==0 or len(y_test)==0:
            return self._evaluate()
        if normalize:
            x_test = np.array([np.transpose(np.array(image).reshape(self._shape, self._shape)) for image in x_test])
            x_test = tf.keras.utils.normalize(x_test, axis=1)
            y_test = np.array(y_test) + add_to_label
        val_loss, val_acc = self._model.evaluate(
            x_test, y_test, verbose=0)
        return val_loss, val_acc
    
    def _evaluate(self):
        val_loss, val_acc = self._model.evaluate(
            self._normalized_x_test, self._y_test, verbose=0)
        return val_loss, val_acc

    def predict_one(self, inp, only_best=True, get_char=True, normalize=True,list_type=True,show_image=False):
        if list_type:
            inp = np.array([np.array(inp).reshape(self._shape, self._shape)])
        if normalize:
            inp = tf.keras.utils.normalize(inp, axis=1)
        print('inp',inp.shape)
        if show_image:
            showImage(inp[0],save=True)
        pred = self._model.predict(inp)
        if only_best:
            pred = [np.argmax(p) for p in pred]
        else:
            top_k_values, top_k_indices = tf.nn.top_k(pred, k=5)
            top_k_values = top_k_values.numpy().tolist()
            top_k_indices = top_k_indices.numpy().tolist()
            print(top_k_indices,top_k_values)
            return [float(v) for v in top_k_values[0]], [self.get_char_from_pred(i) for i in top_k_indices[0]]
        if get_char:
            return self.get_char_from_pred(pred[0]), pred[0]
        return None, pred[0]

    def get_char_from_pred(self, pred):
        if hasattr(pred, "__len__"):
            pred = np.argmax(pred)
        return self._labelToMeaningfulOutput(pred)

    def _normalize_input(self):
        self._normalized_x_train = tf.keras.utils.normalize(
            self._x_train, axis=1)
        self._normalized_x_test = tf.keras.utils.normalize(
            self._x_test, axis=1)
        self._normalized = True

    def _get_unique_labels(self):
        unique = set()
        for label in self._y_train:
            unique.add(label)
        return len(unique)

    def _print(self, *args, sep=' ', end='\n', file=sys.stdout, flush=False):
        if self._verbose not in [0, 1]:
            print(args, sep=sep, end=end, file=file, flush=flush)
