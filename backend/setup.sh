# 配置conda
wget https://repo.anaconda.com/archive/Anaconda3-2023.07-1-Linux-x86_64.sh
chmod +x Anaconda3-2023.07-1-Linux-x86_64.sh
./Anaconda3-2023.07-1-Linux-x86_64.sh
echo 'export PATH="/home/zhouwei/anaconda3/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
conda --version
conda create --name iot python=3.8
conda activate iot
pip install --upgrade pip

#  装库
pip install blinker cffi click colorama cryptography Flask Flask-SQLAlchemy greenlet itsdangerous Jinja2 MarkupSafe paho-mqtt pycparser PyMySQL SQLAlchemy Werkzeug -i https://pypi.tuna.tsinghua.edu.cn/simple