FROM python:latest

WORKDIR /app

RUN apt-get update
RUN pip install --upgrade pip

COPY requirements.txt /app
RUN pip install -r requirements.txt --no-cache-dir

COPY . /app

ENTRYPOINT ["/app/entrypoint.sh"]