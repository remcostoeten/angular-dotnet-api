#!/bin/bash

set -euo pipefail

PORT="${PORT:-5145}"
FRONTEND_PORT="${FRONTEND_PORT:-4200}"
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

check_running_port() {
  lsof -t -sTCP:LISTEN -i:"$PORT" 2>/dev/null || true
}

check_frontend_port() {
  lsof -t -sTCP:LISTEN -i:"$FRONTEND_PORT" 2>/dev/null || true
}

list_child_pids() {
  local pid="$1"
  pgrep -P "$pid" 2>/dev/null || true
}

kill_process_tree() {
  local pid="$1"
  local signal="${2:-TERM}"
  local child_pid

  while IFS= read -r child_pid; do
    [ -n "$child_pid" ] || continue
    kill_process_tree "$child_pid" "$signal"
  done <<< "$(list_child_pids "$pid")"

  kill "-${signal}" "$pid" 2>/dev/null || true
}

stop_pid() {
  local pid_list="$1"
  local name="$2"
  local pid

  if [ -n "$pid_list" ]; then
    while IFS= read -r pid; do
      [ -n "$pid" ] || continue
      kill_process_tree "$pid" TERM
    done <<< "$pid_list"

    sleep 1

    while IFS= read -r pid; do
      [ -n "$pid" ] || continue
      if kill -0 "$pid" 2>/dev/null; then
        kill_process_tree "$pid" KILL
      fi
      echo "Stopped ${name} PID ${pid}."
    done <<< "$pid_list"
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
    stop_pid "$port_pid" "API"
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
