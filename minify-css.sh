#!/bin/sh

DIR=$(dirname $(readlink -f $0)) # Directory script is in

cd $DIR/public/css

which yuicompressor &>/dev/null || { echo "Please run ./get_yuicompressor.sh before running $0"; exit 1; }

#csstidy main.css --template=highest main.min.css
#csstidy test.css --template=highest test.min.css
yuicompressor --type css -o main.min.css main.css

cat main.min.css    > all.min.css
#echo               >> all.min.css
#cat test.min.css   >> all.min.css

