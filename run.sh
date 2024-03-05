#!/bin/bash

# This script is only for development purposes
# It requires GNU bash, GNU screen and Redis installed in order to work

if [ "$(redis-cli ping)" = "PONG" ]; then
    SCREEN_NAME="Chess"

    screen -dmS $SCREEN_NAME && screen -S $SCREEN_NAME -X stuff "cd backend\npython3 manage.py runserver\n"

    screen -S $SCREEN_NAME -X screen && screen -S $SCREEN_NAME -X stuff "cd frontend\nnpm run start\n"

    screen -S $SCREEN_NAME -X screen && screen -s $SCREEN_NAME -X stuff "cd frontend/src/styles\nsass --watch main.scss main.css\n"

    screen -r $SCREEN_NAME
fi
