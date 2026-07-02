#!/usr/bin/env python3
"""
Free image generation fallback via Pollinations.ai -- no API key, no billing.

Use when the Gemini API is unavailable or the project has no image quota
(free tier). Quality is FLUX-based and solid, but there is no editing,
no multi-turn chat, and heavy load can mean slow responses.

Usage:
    python3 free_generate.py --prompt "..." [--width 1024] [--height 1024]
                             [--model flux] [--output PATH] [--seed N]

Output: JSON line with {"success": true, "path": "..."} or {"error": true, ...}
"""

import argparse
import json
import os
import sys
import time
import urllib.parse
import urllib.request

API_BASE = "https://image.pollinations.ai/prompt"
DEFAULT_OUTPUT_DIR = os.path.expanduser("~/Documents/nanobanana_generated")

# Common aspect ratios mapped to pixel dimensions (longest side 1024)
ASPECT_RATIOS = {
    "1:1": (1024, 1024),
    "16:9": (1024, 576),
    "9:16": (576, 1024),
    "4:3": (1024, 768),
    "3:4": (768, 1024),
    "3:2": (1024, 683),
    "2:3": (683, 1024),
    "21:9": (1024, 439),
}


def generate(prompt, width, height, model, seed, output, retries=3):
    params = {"width": width, "height": height, "nologo": "true", "model": model}
    if seed is not None:
        params["seed"] = seed
    url = f"{API_BASE}/{urllib.parse.quote(prompt)}?{urllib.parse.urlencode(params)}"

    req = urllib.request.Request(url, headers={"User-Agent": "banana-claude-skill"})
    last_err = None
    for attempt in range(1, retries + 1):
        try:
            with urllib.request.urlopen(req, timeout=180) as resp:
                data = resp.read()
            if len(data) < 1000:
                raise RuntimeError(f"Response too small ({len(data)} bytes), not an image")
            os.makedirs(os.path.dirname(output), exist_ok=True)
            with open(output, "wb") as f:
                f.write(data)
            return {"success": True, "path": output, "bytes": len(data),
                    "model": model, "size": f"{width}x{height}", "provider": "pollinations.ai"}
        except Exception as e:  # noqa: BLE001 -- report any failure as JSON
            last_err = str(e)
            if attempt < retries:
                wait = 2 ** attempt
                print(json.dumps({"retry": True, "attempt": attempt,
                                  "wait_seconds": wait, "reason": last_err}))
                time.sleep(wait)
    return {"error": True, "message": last_err,
            "hint": "If this runs in a sandboxed environment, image.pollinations.ai "
                    "must be allowed by the network policy."}


def main():
    parser = argparse.ArgumentParser(description="Free image generation via Pollinations.ai")
    parser.add_argument("--prompt", required=True)
    parser.add_argument("--width", type=int, default=None)
    parser.add_argument("--height", type=int, default=None)
    parser.add_argument("--aspect-ratio", default=None, choices=sorted(ASPECT_RATIOS))
    parser.add_argument("--model", default="flux", help="flux (default) or turbo")
    parser.add_argument("--seed", type=int, default=None)
    parser.add_argument("--output", default=None, help="Output file path (.jpg)")
    args = parser.parse_args()

    width, height = args.width, args.height
    if args.aspect_ratio and not (width and height):
        width, height = ASPECT_RATIOS[args.aspect_ratio]
    width = width or 1024
    height = height or 1024

    output = args.output or os.path.join(
        DEFAULT_OUTPUT_DIR, f"pollinations_{int(time.time())}.jpg")

    result = generate(args.prompt, width, height, args.model, args.seed, output)
    print(json.dumps(result))
    sys.exit(0 if result.get("success") else 1)


if __name__ == "__main__":
    main()
