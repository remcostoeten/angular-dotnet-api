#!/bin/bash

set -euo pipefail

PORT="${PORT:-5145}"
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

check_running_port() {
  lsof -t -i:"$PORT" 2>/dev/null || true
}

run_api() {
  cd "$ROOT_DIR/backend/Assessment.Api"
  nohup env ASPNETCORE_URLS="http://localhost:${PORT}" dotnet run >/dev/null 2>&1 &
  local api_pid=$!
  echo "API started in background on http://localhost:${PORT} (PID ${api_pid})."
}

port_pid=$(check_running_port)

if [ -n "$port_pid" ]; then
  echo "Port ${PORT} is currently in use by PID ${port_pid}."
  read -r -p "Do you want to stop the process using this port? (Y/n): " answer

  case "$answer" in
  "" | y | Y | yes | YES)
    kill "$port_pid" || true
    echo "Stopped PID ${port_pid}."
    ;;
  *)
    echo "Keeping PID ${port_pid} running."
    exit 0
    ;;
  esac
else
  echo "Port ${PORT} is not in use."
fi

if [ -n "$(check_running_port)" ]; then
  echo "Port ${PORT} is still in use. API will not be started."
  exit 1
fi

read -r -p "Run api? (Y/n): " run_answer
case "$run_answer" in
"" | y | Y | yes | YES)
  run_api
  ;;
*)
  echo "bye."
  ;;
esac
