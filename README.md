# Chess Application
Chess Web Application created using Django, React and SASS with full duplex communication using WebSockets.
## Requirements
* [Python](https://www.python.org/downloads/) >= 3.8
* [Node](https://nodejs.org/en/download) >= 18
* [MySQL](https://www.mysql.com/downloads/)
* [Redis](https://redis.io/download/)
* [SASS](https://sass-lang.com/install/)
* [Git](https://git-scm.com/downloads)
## Installation and Configuration
1. Open up terminal and move to directory you want to install this project.
2. Clone project from github using `git clone https://github.com/PopoRafon/Chess-Application.git` command.
3. Move to `Chess` directory inside your project directory.
4. Create `.env` file in the same directory and set `SECRET_KEY=my_generated_secret_key`. **Recommended to create secret key using Django's built-in `get_random_secret_key` function**
5. **(OPTIONAL)** If you want to be able to play against AI install 3rd party engine **(Stockfish recommended)** and in `.env` file set `ENGINE_PATH=path/to/engine`.
6. Create database in MySQL.
7. In `Chess` directory rename `myexample.cnf` file to `my.cnf` and edit this file:
* set `database` to your database name
* set `user` to your database user
* set `password` to your database password
8. In your project main directory run `python manage.py migrate` command to apply all migrations to database.
9. Move to `frontend` directory and install all React dependencies by running `npm install` command.
## Usage
**On machines with installed GNU bash and GNU screen you can simply start Redis server and run `run.sh` script.**
1. Start Redis server (`sudo service redis-server start` command on Linux).
2. Start Django server using `python manage.py runserver` command in your project main directory.
3. Open new terminal window and start React server using `npm start` command inside frontend directory.
4. **(If you want to change any CSS file)** Open new terminal window and move to `frontend/src/styles` directory and run SASS to compile `main.scss` file into `main.css`.
## Features
- Full duplex communication using WebSockets for real-time moves and updates.
- Play against a computer opponent (AI) with the ability to configure and use third-party engines like Stockfish.
- Play chess against other online users in real-time.
- Save and resume ongoing games, allowing players to continue their matches later.
- Responsive and user-friendly interface for both desktop and mobile devices.
- Automated testing for both Django backend and React frontend components.
## Testing
- Django testing: run `python manage.py test` command in your project main directory.
- React testing: run `npm test` command in your project `frontend` directory.
## Author
* [Poporafon](https://github.com/PopoRafon)