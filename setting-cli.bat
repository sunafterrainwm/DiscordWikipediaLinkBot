@ECHO off
GOTO start
:find_dp0
SET dp0=%~dp0
EXIT /b
:start
SETLOCAL
CALL :find_dp0

IF EXIST "%dp0%\node.exe" (
	SET "_prog=%dp0%\node.exe"
	SET "_PREFIX=\"\""
) ELSE (
	SET "_prog=node"
	SET PATHEXT=%PATHEXT:;.JS;=;%
	SET "_PREFIX=%dp0%"
)

endLocal & goto #_undefined_# 2>NUL || title %COMSPEC% & "%_prog%"  "%_PREFIX%\src\setting-cli.js" %*
