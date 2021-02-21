from mnist import MNIST
import random
import matplotlib.pyplot as plt
import numpy as np
# Load data
mndata = MNIST('samples')
mndata.gz = True

train_images, train_labels = mndata.load_training()
test_images, test_labels = mndata.load_testing()