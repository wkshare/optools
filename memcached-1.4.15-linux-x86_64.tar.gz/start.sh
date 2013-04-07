#!/bin/bash

if [ $0 != "./start.sh" ]; then
   echo 'error! start.sh requires execution with the path of "./start.sh"'
   exit 1
fi

if [ ! -f ./m.conf ]
then
  echo 'config file m.conf not exists,exit!'
  exit 2
fi

args=`cat ./m.conf | grep -v '^#' | tr '\n' ' '`
echo load config file... args are $args
echo -n 'starting memcached... '
bin/memcached -v -d -P /tmp/m.pid $args 2>> ./m.log
sleep 2
pid=`cat /tmp/m.pid`
echo '['$pid']'
