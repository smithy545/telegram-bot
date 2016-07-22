f = open('./texts.txt', 'r+')
o = open('./clean_texts.txt', 'w')

for line in f.readlines():
    start = 0
    cline = ''
    for c in line:
        if start >= 3:
            cline += c
        if c == ':':
            start = start + 1
    o.write(cline.strip()+'\n')
