#!/usr/bin/env bash
# 打包成 itch.io 用的 HTML5 zip（只放遊戲需要的檔案）
# 用法：scripts/build-itch.sh [輸出路徑]
set -euo pipefail
out="${1:-dist/my-mayor-itch.zip}"
case "$out" in /*) ;; *) out="$PWD/$out" ;; esac  # 相對路徑以執行的位置為準
cd "$(dirname "$0")/.."
mkdir -p "$(dirname "$out")"
rm -f "$out"
zip -qr "$out" index.html style.css og.png js art -x '*.DS_Store'
echo "$out ($(du -h "$out" | cut -f1))"
