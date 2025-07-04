#!/bin/bash

ASSETS_PATH="/usr/share/nginx/html/assets-original"
TIMESTAMP_TOLERANCE=120

# The ASSET_PATH seams to have a modification date that match the last build
# We extract this information and only keep the file near this date

# -d: get directory information, not on its content
# -l: long output,
# --time-style=+@%s@ => time format is a timestamp
# the '@' are added arround the timestamp to be able to easly parse the output, that not trivial without it
# | cut -d '@' -f 2 : extract the timestamp with the help of our @
last_build_timestamp=$(ls -dl --time-style=+@%s@ $ASSETS_PATH | cut -d '@' -f 2)

# Just in case, we adjust the timestamps with an error margin, not sure if necessary
adjusted_timestamp=$(( last_build_timestamp - TIMESTAMP_TOLERANCE ))

# Find all file in our ASSETS PATH and call stat to retrieve its timestamps (%Y) & filename (%n)
# Use awk to only keep line with a timestamps inferiour to our reference
# Cut on our ',' to only keep the filename on each line
# Use xargs to run rm for each line
find ${ASSETS_PATH} -type f -exec stat --format="%Y,%n" {} + \
    | awk -v t="${adjusted_timestamp}" '$1 < t' \
    | cut -d ',' -f2- \
    | xargs -L1 rm
