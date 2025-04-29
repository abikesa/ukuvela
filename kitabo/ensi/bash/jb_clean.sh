#!/bin/bash

# Define target directories

dirs=(
  pdfs
  figures
  media
  testbin
  nis
  myhtml
  dedication
  python
  ai
  r
  stata
  bash
  xml
  data
  aperitivo
  antipasto
  primo
  secondo
  contorno
  insalata
  formaggio-e-frutta
  dolce
  caffe
  digestivo
  jupyter
)

# Create directories under _build/html
for d in "${dirs[@]}"; do
  mkdir -p "_build/html/$d"
  cp -r "$d/"* "_build/html/$d/" 2>/dev/null
done

