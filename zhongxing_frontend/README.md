# hadoop_testing_front

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```bash
npm run serve
```

### Compiles and minifies for production
```bash
npm run build
```

### Lints and fixes files
```bash
npm run lint
```

### Deploy Command
```bash
npm run build &&\
ssh cloud002 "rm -rf /var/www/wgs/hadoop_testing" &&\
scp -r ~/Downloads/xinhe/hadoop_testing_front/dist cloud002:/var/www/wgs/hadoop_testing &&\
rm -rf ~/Downloads/xinhe/hadoop_testing_front/dist
```