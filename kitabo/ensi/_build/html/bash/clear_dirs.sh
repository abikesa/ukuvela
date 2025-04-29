#!/bin/bash

# Change to the morality directory
# cd morality

# Loop through all items in the directory
for item in *; do
    # Check if the item is a directory and not "kitabo"
    if [ -d "$item" ] && [ "$item" != "kitabo" ]; then
        # Remove all contents of the directory
        rm -rf "$item"/*
        echo "Deleted contents of $item"
    fi
done

echo "Finished deleting directory contents"
# flick 20250409213603-RFrQ
# flick 20250409214209-cWhu
# flick 20250409214625-9SJR
# flick 20250409234308-PXmr
# flick 20250410002731-Y2wT
