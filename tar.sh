#!/bin/bash

if [ $# -lt 1 ]; then
    PACKAGES=$(find . -maxdepth 1 -type d | grep -v -E '(\.|\.git)$' | xargs -n1 basename | sort)
else
    PACKAGES=$@
fi

for pkg in $PACKAGES; do
    tar -cvzf $pkg.tar.gz -C $pkg .
done
