#!/usr/bin/bash

wget --progress=dot \
     --show-progress\
     --limit-rate=1000k\
     --wait=6\
     --random-wait\
     --compression=auto\
     --no-check-certificate\
     --ignore-length\
     --mirror\
     --convert-links\
     --page-requisites\
     --no-parent\
     --verbose\
     https://highfivediet.com/
