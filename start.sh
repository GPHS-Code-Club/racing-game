#!/bin/bash
http-server -p 9000 -s &
node server/server.js
