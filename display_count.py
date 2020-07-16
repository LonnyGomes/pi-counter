import os, time
import fourletterphat as flp


pipe_path = "/tmp/countpipe"
if not os.path.exists(pipe_path):
    os.mkfifo(pipe_path)

# Open the fifo. We need to open in non-blocking mode or it will stalls until
# someone opens it for writting
pipe_fd = os.open(pipe_path, os.O_RDONLY)
with os.fdopen(pipe_fd) as pipe:
    while True:
        message = pipe.read()
        if message:
            flp.print_number_str(message)
            flp.show()