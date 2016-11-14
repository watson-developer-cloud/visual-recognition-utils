# Watson-VR-Classifier-Tools
Command line tools to make creating &amp; managing Watson Visual Recognition Custom Classifiers easier.

*This is a work in progress!*

##Usage: 
First, be sure to update local.env and include your Watson Visual Recognition key.

From an OS X or Linux (Bash) terminal, you can run the following commands:

### List all custom classifiers
```./training.sh --list```

### Create a custom classifier
```./training.sh --create```

You will be prompted for a classifier name, and the locations of zip files (containing images) that are used to train the classifier.  **Right now, both positive and negative are required.***

### Delete a custom classifier
```./training.sh --delete```