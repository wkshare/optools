#!/bin/bash

if [ $0 != "./start.sh" ]; then
   echo 'error! start.sh requires execution with the path of "./start.sh"'
   exit 1
fi

if [ ! -f ./mongo.conf ]
then
  echo 'config file mongo.conf not exists,exit!'
  exit 2
fi

args=`cat ./mongo.conf | grep -v '^#' | tr '\n' ' '`
echo load config file... args are $args
echo -n 'starting mongo '
./bin/mongod $args
