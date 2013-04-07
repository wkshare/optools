#!/bin/bash

if [ $0 != "./stop.sh" ]; then
   echo 'error! stop.sh requires execution with the path of "./stop.sh"'
   exit 1
fi

cat /tmp/m.pid | xargs -I{} kill -9 {}
rm -f /tmp/m.pid
