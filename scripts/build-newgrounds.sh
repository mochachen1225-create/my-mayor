#!/usr/bin/env bash
# 打包成 Newgrounds 用的 HTML5 zip：不放 AI 插畫（art/），改用原本的 SVG 頭像
# 用法：scripts/build-newgrounds.sh [輸出路徑]
set -euo pipefail
cd "$(dirname "$0")/.."
out="$(realpath -m "${1:-dist/my-mayor-newgrounds.zip}")"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
cp -r index.html style.css og.png js "$tmp/"
# 在第一個 <script> 前面加上 NO_ART 設定
sed -i '0,/<script /s//<script>window.NO_ART = true;<\/script>\n<script /' "$tmp/index.html"
mkdir -p "$(dirname "$out")"
rm -f "$out"
(cd "$tmp" && zip -qr "$out" . -x '*.DS_Store')
echo "$out ($(du -h "$out" | cut -f1))"
