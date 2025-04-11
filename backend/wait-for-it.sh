#!/usr/bin/env bash
# wait-for-it.sh: Wait for a service to be available
# https://github.com/vishnubob/wait-for-it

WAITFORIT_cmdname=${0##*/}
WAITFORIT_timeout=15
WAITFORIT_strict=0
WAITFORIT_child=0
WAITFORIT_quiet=0
WAITFORIT_host=""
WAITFORIT_port=""
WAITFORIT_result=0

function usage() {
    cat << USAGE >&2
Usage:
    $WAITFORIT_cmdname host:port [-s] [-t timeout] [-- command args]
    -h HOST | --host=HOST       Host or IP under test
    -p PORT | --port=PORT       TCP port under test
    -s | --strict               Only execute subcommand if the test succeeds
    -q | --quiet                Don't output any status messages
    -t TIMEOUT | --timeout=TIMEOUT
                                Timeout in seconds, zero for no timeout
    -- COMMAND ARGS             Execute command with args after the test finishes
USAGE
    exit 1
}

# process arguments
while [[ $# -gt 0 ]]
do
    case "$1" in
        *:* )
        WAITFORIT_hostport=(${1//:/ })
        WAITFORIT_host=${WAITFORIT_hostport[0]}
        WAITFORIT_port=${WAITFORIT_hostport[1]}
        shift 1
        ;;
        --host=*)
        WAITFORIT_host="${1#*=}"
        shift 1
        ;;
        --port=*)
        WAITFORIT_port="${1#*=}"
        shift 1
        ;;
        -q | --quiet)
        WAITFORIT_quiet=1
        shift 1
        ;;
        -s | --strict)
        WAITFORIT_strict=1
        shift 1
        ;;
        -t)
        WAITFORIT_timeout="$2"
        if [[ $WAITFORIT_timeout == "" ]]; then break; fi
        shift 2
        ;;
        --timeout=*)
        WAITFORIT_timeout="${1#*=}"
        shift 1
        ;;
        --)
        shift
        WAITFORIT_CLI=("$@")
        break
        ;;
        --help)
        usage
        ;;
        *)
        echoerr "Unknown argument: $1"
        usage
        ;;
    esac
done

if [[ "$WAITFORIT_host" == "" || "$WAITFORIT_port" == "" ]]; then
    echoerr "Error: you need to provide a host and port to test."
    usage
fi

function wait_for() {
    if [[ $WAITFORIT_quiet -ne 1 ]]; then
        echo "Waiting for $WAITFORIT_host:$WAITFORIT_port..."
    fi
    local start_ts=$(date +%s)
    while :
    do
        (echo > /dev/tcp/$WAITFORIT_host/$WAITFORIT_port) >/dev/null 2>&1
        local result=$?
        if [[ $result -eq 0 ]]; then
            local end_ts=$(date +%s)
            local timeout=$((end_ts - start_ts))
            if [[ $WAITFORIT_quiet -ne 1 ]]; then
                echo "$WAITFORIT_host:$WAITFORIT_port is available after $timeout seconds"
            fi
            break
        fi
        if [[ $WAITFORIT_timeout -gt 0 && $(date +%s) -gt $(( $start_ts + $WAITFORIT_timeout )) ]]; then
            echo "Operation timed out" >&2
            exit 1
        fi
        sleep 1
    done
    return $result
}

wait_for
WAITFORIT_RESULT=$?

if [[ $WAITFORIT_RESULT -ne 0 && $WAITFORIT_strict -eq 1 ]]; then
    if [[ $WAITFORIT_quiet -ne 1 ]]; then
        echo "Failed to connect to $WAITFORIT_host:$WAITFORIT_port"
    fi
    exit $WAITFORIT_RESULT
fi

if [[ "${#WAITFORIT_CLI[@]}" -ne 0 ]]; then
    if [[ $WAITFORIT_quiet -ne 1 ]]; then
        echo "Running command: ${WAITFORIT_CLI[*]}"
    fi
    exec "${WAITFORIT_CLI[@]}"
else
    exit $WAITFORIT_RESULT
fi