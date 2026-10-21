#!/bin/bash

echo "[+] Starting setup for WhatsApp Pairing Test..."

# 1. تثبيت حزم الـ Node.js والـ Git لو غير موجودة
if ! command -v node &> /dev/null; then
    echo "[-] Node.js is not installed. Please install it first."
    exit 1
fi

# 2. إنشاء مجلد العمل والانتقال إليه
mkdir -p wa-test-env && cd wa-test-env

# 3. إنشاء ملف package.json تلقائياً وتثبيت المكاتب (Baileys & Pino)
echo "[+] Installing dependencies (@whiskeysockets/baileys and pino)..."
npm init -y > /dev/null 2>&1
npm install @whiskeysockets/baileys@latest pino@latest --silent

# 4. جلب الكود المشوش (الملف الأساسي index.js) من المستودع أو رابطه المباشر
echo "[+] Downloading obfuscated core..."
curl -s -o index.js https://raw.githubusercontent.com/AlkhatimMuhammed/obatest/main/index.js

echo "========================================"
echo "[+] Setup completed successfully! 🚀"
echo "[+] To run the test, type: cd wa-test-env && node index.js"
echo "========================================"
