#!/bin/sh
DIR=$(realpath $0)
DIR=$(echo "${DIR%/*}")
cd $DIR
node keystone
