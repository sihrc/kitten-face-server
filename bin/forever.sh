#!/bin/bash
forever start /kittyface/app.js
forever logs 0 -f
