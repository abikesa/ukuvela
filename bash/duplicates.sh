#!/bin/bash

`find . -maxdepth 4 | grep ' 2\(\..*\)\?$' | while read -r f; do rm -rf "$f"; done`