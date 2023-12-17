FROM python:3.10

WORKDIR /backend
COPY . /backend

RUN pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
RUN chmod +x /backend/run.sh
#CMD ["python", "/backend/iot_backend.py"]
CMD /backend/run.sh
