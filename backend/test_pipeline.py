import json
import urllib.request
import urllib.parse
import urllib.error
import base64
import numpy as np
import cv2
import uuid
import mimetypes

def encode_multipart_formdata(fields, files):
    boundary = uuid.uuid4().hex
    body = []
    for key, value in fields.items():
        body.append(f'--{boundary}\r\nContent-Disposition: form-data; name="{key}"\r\n\r\n{value}\r\n')
    for key, filename, value, mimetype in files:
        body.append(f'--{boundary}\r\nContent-Disposition: form-data; name="{key}"; filename="{filename}"\r\nContent-Type: {mimetype}\r\n\r\n'.encode('utf-8'))
        body.append(value)
        body.append(b'\r\n')
    body.append(f'--{boundary}--\r\n'.encode('utf-8'))
    
    # join all parts
    encoded_body = b''
    for part in body:
        if isinstance(part, str):
            encoded_body += part.encode('utf-8')
        else:
            encoded_body += part
            
    return encoded_body, f'multipart/form-data; boundary={boundary}'

# Create a dummy image
img = np.zeros((512, 512), dtype=np.uint8)
cv2.rectangle(img, (100, 100), (400, 400), 255, -1)
_, buffer = cv2.imencode('.png', img)
b_img = buffer.tobytes()

# Upload
body, content_type = encode_multipart_formdata({}, [("file", "test.png", b_img, "image/png")])

req = urllib.request.Request("http://localhost:8000/api/upload", data=body, headers={'Content-Type': content_type})
with urllib.request.urlopen(req) as response:
    res_text = response.read().decode('utf-8')
    print("Upload:", response.status, res_text[:100])
    image_id = json.loads(res_text)["id"]

# Process pipeline with 5 steps
steps = [
    {"module": "windowing", "config": {"preset": "lung"}},
    {"module": "noise-removal", "config": {"method": "gaussian"}},
    {"module": "edge-detection", "config": {"method": "sobel"}},
    {"module": "noise-removal", "config": {"method": "median"}},
    {"module": "edge-detection", "config": {"method": "canny"}},
]

payload = {
    "image_id": image_id,
    "steps": steps
}
json_payload = json.dumps(payload).encode('utf-8')

req2 = urllib.request.Request("http://localhost:8000/api/process/pipeline", data=json_payload, headers={'Content-Type': 'application/json'})

try:
    with urllib.request.urlopen(req2) as response:
        print("Process:", response.status)
        print("Response:", response.read().decode('utf-8')[:100])
except urllib.error.HTTPError as e:
    print("HTTPError:", e.code)
    print(e.read().decode('utf-8'))
except Exception as e:
    print("Exception:", e)
