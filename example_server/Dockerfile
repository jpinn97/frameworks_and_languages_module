FROM python:alpine as base
    WORKDIR /app/
    EXPOSE 8000

FROM base as python_dependencies
    COPY ./requirements.txt ./
    RUN pip install --no-cache-dir -r requirements.txt -t /site-packages
    ENV PYTHONPATH=/site-packages
FROM python_dependencies as python_dependencies_test
    COPY ./requirements.test.txt ./
    RUN pip install --no-cache-dir -r requirements.test.txt -t /site-packages

FROM python_dependencies as code
    COPY main.py .
    COPY /app ./app

FROM code as test
    COPY --from=python_dependencies_test /site-packages /site-packages
    #COPY --from=python_dependencies_test /usr/local/bin/pytest /usr/local/bin/pytest
    COPY ./pytest.ini ./
    RUN pytest

FROM code as main
    CMD ["python3", "main.py"]
