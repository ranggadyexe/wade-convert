import os

# Suite test mengirim banyak permintaan dari satu IP (testclient);
# naikkan batas rate limit agar tidak flaky.
os.environ["RATE_LIMIT_PER_MINUTE"] = "10000"
