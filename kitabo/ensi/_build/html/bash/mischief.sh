
#!/bin/bash

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
)

# List of random extensions
exts=(txt md dat csv log bak old new)

for d in "${dirs[@]}"; do
  if [ ! -d "$d" ]; then
    mkdir "$d"
    # Generate a random filename and extension
    fname=$(tr -dc a-z0-9 </dev/urandom | head -c 8)
    ext=${exts[$RANDOM % ${#exts[@]}]}
    touch "$d/$fname.$ext"
  fi
done
# flick 20250409213603-lvR6
# flick 20250409214210-oCVA
# flick 20250409214626-txTm
# flick 20250409220130-KNgB
# flick 20250409221405-79ap
# flick 20250409230558-sA4h
# flick 20250409231147-9epb
