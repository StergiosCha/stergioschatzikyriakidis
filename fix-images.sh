#!/bin/bash
cd app/src/sections
sed -i '' 's|src="/images/|src="/stergioschatzikyriakidis/images/|g' *.tsx
sed -i '' 's|src="images/|src="/stergioschatzikyriakidis/images/|g' *.tsx
sed -i '' 's|src="./images/|src="/stergioschatzikyriakidis/images/|g' *.tsx
