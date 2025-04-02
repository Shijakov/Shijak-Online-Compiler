# Use Python image
FROM python:3.11

ENV APP_ENV=production

RUN apt-get update && apt-get install -y wget \
    && wget -O /tmp/openjdk-24.tar.gz https://download.oracle.com/java/24/latest/jdk-24_linux-x64_bin.tar.gz  \
    && mkdir -p /usr/lib/jvm \
    && tar zxvf /tmp/openjdk-24.tar.gz -C /usr/lib/jvm \
    && rm /tmp/openjdk-24.tar.gz
#RUN apt-get update && apt-get install -y wget \
#    && wget -O /tmp/openjdk-21.tar.gz https://download.java.net/java/GA/jdk21.0.1/7e0f02e8b6f14f2a9f66d31d354e49ec/21/GPL/openjdk-21_linux-x64_bin.tar.gz \
#    && mkdir -p /usr/lib/jvm \
#    && tar -xvf /tmp/openjdk-21.tar.gz -C /usr/lib/jvm \
#    && rm /tmp/openjdk-21.tar.gz

ENV JAVA_HOME=/usr/lib/jvm/jdk-24
ENV PATH="$JAVA_HOME/bin:$PATH"

RUN mkdir -p /root/.java/.userPrefs && chmod -R 777 /root/.java

# Set working directory
WORKDIR /workers

# Copy the Python script and JAR file
COPY . .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

#CMD ["ls", "/usr/lib/jvm/jdk-24/bin"]
CMD ["python", "code_process_worker.py"]
