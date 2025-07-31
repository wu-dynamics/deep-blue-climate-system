#!/bin/bash

if ! nmcli -t -f WIFI g | grep -q enabled; then
  echo "正在开启 WIFI……"
  nmcli radio wifi on
fi

if ! nmcli -t -f STATE general | grep -q "connected"; then
  nmcli dev wifi
  echo "当前未联网，请输入Wi-Fi名称（SSID）:"
  read ssid
  echo "请输入Wi-Fi密码:"
  read -s password
  nmcli dev wifi connect "$ssid" password "$password"
fi

curl -LsSf https://gitee.com/wangnov/uv-custom/releases/download/latest/uv-installer-custom.sh | sh
