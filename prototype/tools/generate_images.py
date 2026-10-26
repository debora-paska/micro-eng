#!/usr/bin/env python3
"""Generates the prototype illustrations with fal.ai nano-banana.

Run from anywhere: python3 tools/generate_images.py [image-id ...]
Existing images are skipped, so delete a file to regenerate it.
The key is read from FAL_KEY or from the repo-root .fal.env and never written elsewhere.
"""

import base64
import concurrent.futures
import json
import os
import pathlib
import ssl
import sys
import urllib.error
import urllib.request

PROTOTYPE_DIR = pathlib.Path(__file__).resolve().parent.parent
IMAGES_DIR = PROTOTYPE_DIR / "images"
KEY_FILE = PROTOTYPE_DIR.parents[2] / ".fal.env"

TEXT_TO_IMAGE = "https://fal.run/fal-ai/nano-banana"
EDIT = "https://fal.run/fal-ai/nano-banana/edit"

# python.org builds on macOS ship without CA certificates; fall back to the system bundle.
SYSTEM_CA = pathlib.Path("/etc/ssl/cert.pem")
SSL_CONTEXT = ssl.create_default_context(cafile=SYSTEM_CA if SYSTEM_CA.exists() else None)

STYLE = (
    "Hand-drawn editorial illustration for a business magazine, made by a human illustrator. "
    "Bold, slightly wobbly black brush-ink lines with visible imperfections, simple geometric shapes, "
    "characters reduced to essentials: small dot eyes, minimal features, expressive posture and gesture doing the storytelling. "
    "Very limited Pack brand palette of flat gouache colours: vivid Pack orange (#FF5D18) as the hero accent, soft peach (#FFE8D9), "
    "ink black (#0E0E0E), warm off-white paper, and one muted deep teal used sparingly as the only secondary colour. "
    "slightly uneven fills that do not exactly match the outlines, visible paper texture, lots of negative space, "
    "sparse office props drawn with a few lines, a touch of visual wit. "
    "Not glossy, not 3D, no gradients, no digital airbrush shading, no hyper-detailed rendering. "
    "Absolutely no text, no letters, no words, no speech bubbles, no captions, no logos."
)

CAST = (
    "SARA: team manager, woman in her early 40s, short curly dark brown hair, round tortoiseshell glasses, "
    "soft peach cardigan over a white shirt, black trousers. "
    "MARCO: her direct report, man in his early 30s, light brown skin, short black hair, neatly trimmed beard, "
    "vivid Pack orange (#FF5D18) overshirt over a white t-shirt, dark grey jeans. "
    "ELENA: experienced mentor, woman around 60, silver straight bob haircut, muted deep teal blazer, black trousers, small pearl earrings."
)

PANEL = "Single comic panel. Keep every character exactly as in the reference sheet (faces, hair, clothes). "

IMAGES = [
    # The sheet comes first: every other image uses it as reference for consistency.
    ("character-sheet", "16:9", False,
     f"Character reference sheet with three characters standing side by side, full body, front view, "
     f"relaxed neutral expressions, plain light sand background, generous spacing. {CAST} {STYLE}"),
    ("cover-feedback", "3:4", True,
     "Story cover. A glass-walled small meeting room seen from outside: Sara sits on one side of a table "
     "holding a printed report, Marco on the other side looks away, tense silence, dramatic composition."),
    ("cover-offer", "3:4", True,
     "Story cover. Marco in a quiet corner of the office looking at his phone with a mixture of excitement "
     "and guilt; in the far background Sara at her desk, unaware."),
    ("cover-mentee", "3:4", True,
     "Story cover. ELENA (the woman around 60 with silver straight bob and teal blazer from the reference sheet, not Sara) in a cosy café-style meeting corner with a young mentee (a woman in her mid 20s, "
     "long black braids, orange sweater) who looks at her expectantly; Elena smiles and holds back an answer."),
    ("p-hook", "4:3", True,
     "Open-plan office on a Monday morning. In the foreground Sara at her desk frowning at her laptop. "
     "In the background Marco walks in late holding a takeaway coffee, relaxed and unaware."),
    ("p-open-blame", "4:3", True,
     "Small meeting room. Sara leans forward, finger tapping the table, stern face. "
     "Marco on the other side of the table with arms crossed, defensive, jaw tight."),
    ("p-open-vague", "4:3", True,
     "Small meeting room. Sara smiles politely with a relaxed posture. "
     "Marco leans back casually, smiling, completely at ease."),
    ("p-open-sbi", "4:3", True,
     "Small meeting room. Sara calm and attentive, open hands resting on the table. "
     "Marco looks down thoughtfully, slightly embarrassed but open, about to speak. Only Sara and Marco appear in this panel: do not draw Elena or anyone else from the reference sheet."),
    ("p-explain", "4:3", True,
     "Small meeting room, over-the-shoulder shot from behind Sara. Marco faces the viewer, gesturing while he "
     "explains, tired eyes, sincere expression. Only Sara and Marco appear in this panel: do not draw Elena or anyone else from the reference sheet."),
    ("p-resp-dismiss", "4:3", True,
     "Meeting room. Sara points at a printed project plan on the table, firm. "
     "Marco slumped in his chair, deflated, looking away. Only Sara and Marco appear in this panel: do not draw Elena or anyone else from the reference sheet."),
    ("p-resp-curious", "4:3", True,
     "Meeting room. Sara leans in and takes notes in a notebook, nodding. "
     "Marco relieved, shoulders relaxed, slight smile, pointing at something in the notebook. Only Sara and Marco appear in this panel: do not draw Elena or anyone else from the reference sheet."),
    ("p-resp-avoid", "4:3", True,
     "Meeting room. Sara gives a quick shrug and a smile while closing her laptop. "
     "Marco shrugs back, uncertain half smile."),
    ("p-close", "4:3", True,
     "Meeting room at the end of the meeting: Sara and Marco both standing near the glass door, Sara holding "
     "her notebook, a moment before leaving."),
    ("end-good", "4:3", True,
     "Two weeks later, bright open office. Marco confidently presents on a wall screen to two new hires "
     "who take notes; Sara in the background smiles with a discreet thumbs up. Sara is the woman with curly hair, glasses and peach cardigan. Elena does not appear."),
    ("end-mixed", "4:3", True,
     "Two weeks later, office in the evening. Marco alone at his desk working late, lit by his monitor, "
     "tired but focused. Sara leaving with her coat on, glancing back at him."),
    ("end-poor", "4:3", True,
     "Two weeks later, office. Marco at his desk staring out of the window, distracted, holding his phone "
     "(screen not visible). Sara far in the background on a phone call, not noticing. Sara is the woman with curly hair, glasses and peach cardigan. Elena does not appear."),
    ("mentor", "1:1", True,
     "Head and shoulders portrait of ELENA, the woman around 60 on the right of the reference sheet: silver straight bob, "
     "muted deep teal blazer, pearl earrings. Warm confident smile, plain soft sand background. Do not draw Sara or Marco."),
    ("mentor-session", "4:3", True,
     "Sara at a home desk in front of a laptop during a video call; Elena is visible on the laptop screen, "
     "smiling and listening. Sara holds her notebook and talks, engaged."),
]


def load_key() -> str:
    key = os.environ.get("FAL_KEY")
    if key:
        return key
    for line in KEY_FILE.read_text().splitlines():
        if line.startswith("FAL_KEY="):
            return line.split("=", 1)[1].strip().strip("'\"")
    sys.exit(f"FAL_KEY not found in environment or {KEY_FILE}")


def call_fal(endpoint: str, payload: dict, key: str) -> dict:
    request = urllib.request.Request(
        endpoint,
        data=json.dumps(payload).encode(),
        headers={"Authorization": f"Key {key}", "Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(request, timeout=300, context=SSL_CONTEXT) as response:
            return json.load(response)
    except urllib.error.HTTPError as error:
        raise RuntimeError(f"{error.code}: {error.read().decode()[:500]}") from None


def sheet_data_uri() -> str:
    encoded = base64.b64encode((IMAGES_DIR / "character-sheet.jpg").read_bytes()).decode()
    return f"data:image/jpeg;base64,{encoded}"


def generate(image_id: str, aspect_ratio: str, uses_sheet: bool, prompt: str, key: str) -> str:
    target = IMAGES_DIR / f"{image_id}.jpg"
    if target.exists():
        return f"skip {image_id}"
    payload = {"num_images": 1, "output_format": "jpeg", "aspect_ratio": aspect_ratio}
    if uses_sheet:
        payload |= {"prompt": f"{PANEL}{prompt} {STYLE}", "image_urls": [sheet_data_uri()]}
        result = call_fal(EDIT, payload, key)
    else:
        payload["prompt"] = prompt
        result = call_fal(TEXT_TO_IMAGE, payload, key)
    url = result["images"][0]["url"]
    with urllib.request.urlopen(url, timeout=120, context=SSL_CONTEXT) as response:
        target.write_bytes(response.read())
    return f"ok   {image_id}"


def main() -> None:
    key = load_key()
    IMAGES_DIR.mkdir(exist_ok=True)
    wanted = set(sys.argv[1:])
    selected = [image for image in IMAGES if not wanted or image[0] in wanted]

    sheet = [image for image in selected if not image[2]]
    panels = [image for image in selected if image[2]]
    for image in sheet:
        print(generate(*image, key), flush=True)

    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        futures = {pool.submit(generate, *image, key): image[0] for image in panels}
        for future in concurrent.futures.as_completed(futures):
            try:
                print(future.result(), flush=True)
            except Exception as error:  # keep the others going, report at the end
                print(f"FAIL {futures[future]}: {error}", flush=True)


if __name__ == "__main__":
    main()
