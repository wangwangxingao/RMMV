@echo off 
echo 放在nwjs文件夹,且插件在该文件夹的www\js\plugins\中
echo 请输入插件名称,加密后的bin名,和调用加密bin的插件(会覆盖插件)
echo 加密的部分运行会慢,请谨慎使用
set input=:
set /p input=请输入插件名称:
set input2=:
set /p input2=请输入转化成的bin名:
set input3=:
set /p input3=请输入调用bin的插件:
echo 处理中
nwjc www\js\plugins\%input%.js %input2%.bin
echo 处理完成, 
echo require('nw.gui').Window.get().evalNWBin(null,'%input2%.bin'); >www\js\plugins\%input3%.js 
pause
 
