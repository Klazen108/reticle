# Teamforge JAR
This plugin requires the teamforge jar `tf-server.jar` and dependencies

# Trust Teamforge
```bat
openssl s_client -showcerts -connect {tf_url}:{tf_port}
rem save between ---BEGIN--- and ---END--- (inclusive) to teamforge.crt, then:
keytool -importcert -keystore %JAVA_HOME%\jre\lib\security\cacerts -file teamforge.crt
rem default password is 'changeit'
```