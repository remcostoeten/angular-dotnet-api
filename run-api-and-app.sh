#!/bin/bash

set -euo pipefail

PORT="${PORT:-5145}"
FRONTEND_PORT="${FRONTEND_PORT:-4200}"
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

check_running_port() {
  lsof -t -i:"$PORT" 2>/dev/null || true
}

check_frontend_port() {
  lsof -t -i:"$FRONTEND_PORT" 2>/dev/null || true
}

stop_pid() {
  local pid="$1"
  local name="$2"

  if [ -n "$pid" ]; then
    kill "$pid" || true
    echo "Stopped ${name} PID ${pid}."
  else
    echo "${name} is not running."
  fi
}

run_api() {
  cd "$ROOT_DIR/backend/Assessment.Api"
  nohup env ASPNETCORE_URLS="http://localhost:${PORT}" dotnet run >/dev/null 2>&1 &
  local api_pid=$!
  echo "API started in background on http://localhost:${PORT} (PID ${api_pid})."
}

run_frontend() {
  cd "$ROOT_DIR/frontend"
  nohup npm start >/dev/null 2>&1 &
  local frontend_pid=$!
  echo "Frontend started in background on http://localhost:${FRONTEND_PORT} (PID ${frontend_pid})."
}

case "${1:-}" in
exit)
  stop_pid "$(check_running_port)" "API"
  stop_pid "$(check_frontend_port)" "Frontend"
  echo "bye."
  exit 0
  ;;
esac

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
  read -r -p "Run frontend too? (y/N): " frontend_answer

  case "$frontend_answer" in
  y | Y | yes | YES)
    run_frontend
    ;;
  *)
    echo "Frontend not started."
    ;;
  esac
  ;;
*)
  echo "bye."
  ;;
esac
