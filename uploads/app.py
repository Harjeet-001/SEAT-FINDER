from flask import Flask, render_template, request, jsonify
import pdfplumber
import re
import os

app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

seat_map = {}
DATA_READY = False


def process_pdf(pdf_path):
    global seat_map, DATA_READY
    seat_map = {}

    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if not text:
                continue

            # ---------- Extract Hall ----------
            hall_no = "UNKNOWN"
            hall_patterns = [
                r"LECTURE\s*HALL\s*[-:]?\s*(LH\s*\d+)",
                r"HALL\s*NO\s*[:\-]?\s*(LH\s*\d+)",
                r"\b(LH\s*\d+)\b"
            ]

            for pattern in hall_patterns:
                m = re.search(pattern, text, re.IGNORECASE)
                if m:
                    hall_no = m.group(1).replace(" ", "")
                    break

            # ---------- Parse Lines ----------
            lines = text.split("\n")

            for line in lines:
                # Normalize spacing
                clean = re.sub(r"\s+", " ", line).strip()

                # Desk | Reg | Name
                match = re.match(
                    r"^(\d+)\s+([A-Z0-9]+)\s+(.+)$",
                    clean
                )

                if match:
                    desk_no = match.group(1)
                    reg_no = match.group(2)
                    name = match.group(3).strip()

                    # Filter junk lines
                    if len(name) < 3 or "REGISTER" in name.upper():
                        continue

                    seat_map[reg_no] = {
                        "desk": desk_no,
                        "hall": hall_no,
                        "name": name
                    }

    DATA_READY = True


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/admin")
def admin():
    return render_template("admin.html")


@app.route("/admin/upload", methods=["POST"])
def upload_pdf():
    global DATA_READY

    file = request.files.get("pdf")
    if not file:
        return jsonify({"error": "No PDF uploaded"}), 400

    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(path)

    process_pdf(path)
    return jsonify({"message": "Seating data loaded successfully"})


@app.route("/lookup", methods=["POST"])
def lookup():
    if not DATA_READY:
        return jsonify({"error": "Seating data not loaded yet"}), 503

    reg_no = request.json.get("reg_no", "").strip()

    if reg_no in seat_map:
        return jsonify(seat_map[reg_no])

    return jsonify({"error": "Registration number not found"}), 404


if __name__ == "__main__":
    app.run(port=10000, debug=True)
