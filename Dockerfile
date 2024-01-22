FROM python:latest
LABEL Maintainer="PopoRafon"

WORKDIR /app

RUN apt-get update
COPY requirements.txt /app
RUN pip install -r requirements.txt --no-cache-dir
COPY . /app

CMD ["python", "manage.py", "runserver"]

EXPOSE 8000