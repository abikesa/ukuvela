#!/usr/bin/env bash
set -e # halt script on error

make site 
bundle exec htmlproofer --allow-hash-href \
--assume-extension ./_site \
--url-ignore "/\/apple-touch*.*/,/\/images/logo/favicon.ico/,/#*/" \
--disable-external \
--only_4xx 

# flick 20250409213603-Rmxp
# flick 20250409214209-ajNo
# flick 20250409214626-IAMj
# flick 20250409230607-WFiC
