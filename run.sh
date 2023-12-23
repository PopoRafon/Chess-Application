#!/bin/bash

# This script is only for development purposes
# It requires GNU bash and GNU screen installed in order to work

# Screen name variable that we can later refer to
SCREEN_NAME="Chess"

# We run our screen in detached mode and run our Django server
screen -dmS $SCREEN_NAME && screen -S $SCREEN_NAME -X stuff "python3 manage.py runserver\n"

# We create new instance of screen and run React server
screen -S $SCREEN_NAME -X screen && screen -S $SCREEN_NAME -X stuff "cd frontend\nnpm run start\n"

# We create another instance of screen and run Sass compiler
screen -S $SCREEN_NAME -X screen && screen -s $SCREEN_NAME -X stuff "cd frontend/src/styles\nsass --watch main.scss main.css\n"

# We reattach our screen
screen -r $SCREEN_NAME
