#!/bin/bash
echo "resize image who is bigger than 100k";
for i in `find . -size +500k`;
do
echo "image $i";
done
