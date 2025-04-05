import sys, os, json, docker, redis, subprocess

def execute_code(code, input_data, execution_id, redis_client):
    shijak_compiler_jar = "./compiler/shijak.jar"
    mars_compiler_jar = "./compiler/mars.jar"

    input_file = "input.shj"
    input_mars_file = "output.mips"

    with open(input_file, "w") as f:
        f.write(code)

    process = subprocess.run(["java", "-jar", shijak_compiler_jar, input_file], capture_output=True, text=True)

    errors = process.stderr

    if errors != "":
        result = json.dumps({
            "status": "failed",
            "output": f"Compiled with errors: {errors}",
        })
        print(result)
        redis_client.set(execution_id, result)
        return

    process = subprocess.Popen(
        ["java", "-jar", mars_compiler_jar, "nc",  input_mars_file],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True  # Ensure input/output are treated as text (not bytes)
    )

    output, error = process.communicate(input_data)

    if error != "":
            result = json.dumps({
                "status": "failed",
                "output": f"Compiled with errors: {error}",
            })
            print(result)
            redis_client.set(execution_id, result)
            return

    print("Compilation successful")

    print(output)
    result = json.dumps({
        "status": "success",
        "output": output,
    })
    print(result)
    redis_client.set(execution_id, result)


def main():
    print("In main")
    redis_url = os.getenv('REDIS_URL')
    redis_port = os.getenv('REDIS_PORT')
    redis_password = os.getenv('REDIS_PASSWORD')

    if redis_url is None:
        redis_url = 'localhost'

    if redis_port is None:
        redis_port = 6379

    print('Before db connection')
    print(redis_url)
    print(redis_port)
    print(redis_password)

#     if redis_password is None:
#         redis_password = ''

    redis_client = redis.StrictRedis(host=redis_url, port=redis_port, password=redis_password, decode_responses=True)

    pubsub = redis_client.pubsub()

    print('After db connection')
    print(redis_url)
    print(redis_port)
    print(redis_password)

    channel_name = "code-channel"
    pubsub.subscribe(channel_name)

    print(f"Listening for messages on '{channel_name}'...")

    # Listen for messages
    for message in pubsub.listen():
        if message['type'] == 'message':  # Ignore 'subscribe' messages
            try:
                data = json.loads(message['data'])  # Decode JSON
                print("Received")  # 'data' is now a Python dict
                execute_code(data['code'], data['input'], data['id'], redis_client)
            except json.JSONDecodeError:
                print(f"Received non-JSON message: {message['data']}")

print("FIRST")
if __name__ == '__main__':
    print('IN first function')
    try:
        main()
    except KeyboardInterrupt:
        print('Interrupted')
        try:
            sys.exit(0)
        except SystemExit:
            os._exit(0)
