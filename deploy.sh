###
 # @Description: 
 # @version: 
 # @Author: sueRim
 # @Date: 2021-11-02 15:11:27
 # @LastEditors: sueRim
 # @LastEditTime: 2021-11-02 15:49:51
### 
#!/usr/bin/env sh
​
# 确保脚本抛出遇到的错误
set -e
​
# 生成静态文件
npm run docs:build
​
# 进入生成的文件夹
cd docs/.vuepress/dist
# 如果是发布到自定义域名
# echo 'www.yourwebsite.com' > CNAME
​
git init
git add -A
git commit -m 'deploy'
​
# 如果发布到 https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:wangxuexue1/Cooleastblog.github.io.git master:gh-pages

cd -